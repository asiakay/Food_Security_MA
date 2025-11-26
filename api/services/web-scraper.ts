import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedBusinessInfo {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export async function scrapeWebsite(url: string): Promise<ScrapedBusinessInfo> {
  const info: ScrapedBusinessInfo = {};

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'FoodSecurityDirectory/1.0 (Data Enrichment Bot)',
      },
    });

    const $ = cheerio.load(response.data);
    const text = $('body').text().toLowerCase();

    // Extract phone number
    const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = response.data.match(phoneRegex);
    if (phones && phones.length > 0) {
      info.phone = phones[0];
    }

    // Extract email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = response.data.match(emailRegex);
    if (emails && emails.length > 0) {
      // Filter out common false positives
      const validEmails = emails.filter(
        (e: string) => !e.includes('example.com') && !e.includes('test')
      );
      if (validEmails.length > 0) {
        info.email = validEmails[0];
      }
    }

    // Extract social media links
    info.socialMedia = {};

    $('a[href*="instagram.com"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !info.socialMedia!.instagram) {
        info.socialMedia!.instagram = href;
      }
    });

    $('a[href*="facebook.com"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !info.socialMedia!.facebook) {
        info.socialMedia!.facebook = href;
      }
    });

    // Try to extract hours
    const hoursKeywords = ['hours', 'open', 'closed'];
    $('*').each((_, el) => {
      const element = $(el);
      const elementText = element.text().toLowerCase();

      if (
        hoursKeywords.some((keyword) => elementText.includes(keyword)) &&
        elementText.length < 200
      ) {
        const potentialHours = element.text().trim();
        if (potentialHours && !info.hours) {
          info.hours = potentialHours;
        }
      }
    });

    return info;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return info;
  }
}

export async function geocodeAddress(
  address: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    // Using OpenStreetMap's Nominatim API (free, no API key required)
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: address,
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'FoodSecurityDirectory/1.0',
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      };
    }

    return null;
  } catch (error) {
    console.error(`Error geocoding address ${address}:`, error);
    return null;
  }
}
