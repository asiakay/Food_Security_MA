import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@anthropic-ai/sdk', () => {
  const createMock = vi.fn();

  const MockAnthropic = class {
    messages: any;
    constructor(config: any) {
      this.messages = {
        create: createMock,
      };
    }
  };

  return {
    default: MockAnthropic,
    mockCreate: createMock,
  };
});

import { callClaudeAI, enrichBusinessData, verifyBusinessData, discoverNewMarkets } from './claude-ai';
import * as AnthropicModule from '@anthropic-ai/sdk';

// Get access to the mock function
const mockCreate = (AnthropicModule as any).mockCreate;

describe('Claude AI Service', () => {
  beforeEach(() => {
    mockCreate.mockClear();
  });

  describe('callClaudeAI', () => {
    it('should call the Anthropic API with correct parameters', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'Test response' }],
      });

      const options = {
        systemPrompt: 'You are a helpful assistant',
        userPrompt: 'Hello',
        maxTokens: 1024,
      };

      await callClaudeAI(options);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: expect.any(String),
          max_tokens: 1024,
          system: 'You are a helpful assistant',
          messages: [
            {
              role: 'user',
              content: 'Hello',
            },
          ],
        })
      );
    });

    it('should use default maxTokens when not provided', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'Test response' }],
      });

      const options = {
        systemPrompt: 'You are a helpful assistant',
        userPrompt: 'Hello',
      };

      await callClaudeAI(options);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          max_tokens: 4096,
        })
      );
    });

    it('should return text response from API', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'Hello, I am Claude!' }],
      });

      const options = {
        systemPrompt: 'You are a helpful assistant',
        userPrompt: 'Say hello',
      };

      const result = await callClaudeAI(options);

      expect(result).toBe('Hello, I am Claude!');
    });

    it('should throw error for unexpected response type', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'image', data: 'base64...' }],
      });

      const options = {
        systemPrompt: 'You are a helpful assistant',
        userPrompt: 'Test',
      };

      await expect(callClaudeAI(options)).rejects.toThrow('Unexpected response type from Claude API');
    });

    it('should propagate API errors', async () => {
      mockCreate.mockRejectedValue(new Error('API Error'));

      const options = {
        systemPrompt: 'You are a helpful assistant',
        userPrompt: 'Test',
      };

      await expect(callClaudeAI(options)).rejects.toThrow('API Error');
    });
  });

  describe('enrichBusinessData', () => {
    it('should construct proper prompts for business enrichment', async () => {
      const mockResponse = {
        suggestions: [
          {
            field: 'website',
            value: 'https://testfarm.com',
            confidence: 'high',
            source: 'web search',
            reasoning: 'Found on social media',
          },
        ],
      };

      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify(mockResponse) }],
      });

      const result = await enrichBusinessData(
        'Test Farm',
        'Boston, MA',
        { phone: '617-555-0100' }
      );

      expect(mockCreate).toHaveBeenCalled();
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.system).toContain('data enrichment assistant');
      expect(callArgs.messages[0].content).toContain('Test Farm');
      expect(callArgs.messages[0].content).toContain('Boston, MA');

      expect(result).toEqual(mockResponse);
    });

    it('should parse JSON response correctly', async () => {
      const mockResponse = {
        suggestions: [
          {
            field: 'email',
            value: 'test@example.com',
            confidence: 'medium',
            source: 'website contact page',
            reasoning: 'Listed on their website',
          },
        ],
      };

      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify(mockResponse) }],
      });

      const result = await enrichBusinessData(
        'Market Name',
        'Cambridge, MA',
        {}
      );

      expect(result).toEqual(mockResponse);
      expect(result.suggestions).toHaveLength(1);
      expect(result.suggestions[0].field).toBe('email');
    });
  });

  describe('verifyBusinessData', () => {
    it('should construct proper prompts for business verification', async () => {
      const mockResponse = {
        verifications: [
          {
            field: 'phone',
            isValid: false,
            issues: ['Invalid format'],
            suggestions: ['Use XXX-XXX-XXXX format'],
          },
        ],
      };

      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify(mockResponse) }],
      });

      const businessData = {
        business_name: 'Test Farm',
        phone: 'invalid',
      };

      const result = await verifyBusinessData(businessData);

      expect(mockCreate).toHaveBeenCalled();
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.system).toContain('data verification assistant');
      expect(callArgs.messages[0].content).toContain('Test Farm');

      expect(result).toEqual(mockResponse);
    });

    it('should identify validation issues', async () => {
      const mockResponse = {
        verifications: [
          {
            field: 'email',
            isValid: true,
            issues: [],
            suggestions: [],
          },
          {
            field: 'website',
            isValid: false,
            issues: ['URL appears broken'],
            suggestions: ['Verify the website is still active'],
          },
        ],
      };

      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify(mockResponse) }],
      });

      const result = await verifyBusinessData({
        business_name: 'Test',
        email: 'valid@example.com',
        website: 'http://broken.example.com',
      });

      expect(result.verifications).toHaveLength(2);
      expect(result.verifications[0].isValid).toBe(true);
      expect(result.verifications[1].isValid).toBe(false);
      expect(result.verifications[1].issues).toContain('URL appears broken');
    });
  });

  describe('discoverNewMarkets', () => {
    it('should construct proper prompts for market discovery', async () => {
      const mockResponse = {
        discoveries: [
          {
            business_name: 'New Community Farm',
            location: 'Worcester, MA',
            activity: 'Farmers Market',
            website: 'https://newcomfarm.org',
            confidence: 'high',
            source: 'city website',
            notes: 'Open year-round',
          },
        ],
      };

      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify(mockResponse) }],
      });

      const result = await discoverNewMarkets('Worcester');

      expect(mockCreate).toHaveBeenCalled();
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.system).toContain('research assistant');
      expect(callArgs.messages[0].content).toContain('Worcester');

      expect(result).toEqual(mockResponse);
    });

    it('should return multiple discoveries', async () => {
      const mockResponse = {
        discoveries: [
          {
            business_name: 'Market 1',
            location: 'Boston, MA',
            activity: 'Farmers Market',
            website: '',
            confidence: 'high',
            source: 'local news',
            notes: 'Seasonal',
          },
          {
            business_name: 'Market 2',
            location: 'Boston, MA',
            activity: 'Urban Farm',
            website: 'https://market2.org',
            confidence: 'medium',
            source: 'social media',
            notes: 'Black-owned',
          },
        ],
      };

      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify(mockResponse) }],
      });

      const result = await discoverNewMarkets('Boston');

      expect(result.discoveries).toHaveLength(2);
      expect(result.discoveries[0].business_name).toBe('Market 1');
      expect(result.discoveries[1].business_name).toBe('Market 2');
    });
  });
});
