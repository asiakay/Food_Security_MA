# Network Diagram

This is a simple network diagram with three nodes connected in a network topology.

## Diagram

```mermaid
graph TD
    A[Node A] <--> B[Node B]
    B <--> C[Node C]
    A <--> C
```

## Description

- **Node A**: First network node
- **Node B**: Second network node
- **Node C**: Third network node

The nodes are fully connected, forming a mesh network topology where each node can communicate directly with every other node.

## Alternative Representations

### Linear Topology
```mermaid
graph LR
    A[Node A] --> B[Node B]
    B --> C[Node C]
```

### Star Topology
```mermaid
graph TD
    B[Central Node B]
    B --> A[Node A]
    B --> C[Node C]
```

### Hierarchical Topology
```mermaid
graph TD
    A[Root Node A]
    A --> B[Child Node B]
    A --> C[Child Node C]
```
