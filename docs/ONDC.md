# ONDC Integration Guide

## Overview

This guide explains how UMA integrates with the ONDC (Open Network for Digital Commerce) network as a Buyer Network Participant (BAP).

## Table of Contents

1. [ONDC Basics](#ondc-basics)
2. [UMA as a BAP](#uma-as-a-bap)
3. [Integration Architecture](#integration-architecture)
4. [API Flows](#api-flows)
5. [BPP Partners](#bpp-partners)
6. [Implementation Details](#implementation-details)
7. [Testing](#testing)

## ONDC Basics

### What is ONDC?

ONDC is India's open network for digital commerce, enabling:
- Decentralized e-commerce
- Mobility services
- Food & beverage
- Retail commerce

### Network Participants

1. **BAP (Buyer App)**: Consumer-facing applications (like UMA)
2. **BPP (Seller App)**: Service providers (like Namma Yatri)
3. **Gateway**: Routes requests between BAPs and BPPs
4. **Registry**: Maintains network participant directory

## UMA as a BAP

### Our Role

We are a **Buyer Network Participant** that:
- Connects users to mobility BPPs (Namma Yatri, Chalo)
- Orchestrates cross-domain deals (mobility + commerce)
- Bundles services into "Missions"
- Does NOT own supply - we aggregate

### Key Characteristics

- **Domain**: Mobility (`nic2004:60212`)
- **Country**: India (`IND`)
- **Cities**: Bangalore, Manipal (expandable)
- **Version**: ONDC Core 1.0.0

## Integration Architecture

```
┌─────────────────┐
│   UMA Rider     │
│      App        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  UMA Backend    │
│  (BAP Module)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ONDC Gateway    │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│Namma   │ │ Chalo  │
│Yatri   │ │  BPP   │
│  BPP   │ │        │
└────────┘ └────────┘
```

## API Flows

### 1. Search Flow

**Objective**: Find available rides

```javascript
// Request
POST https://gateway.ondc.org/search
{
  "context": {
    "domain": "nic2004:60212",
    "action": "search",
    "bap_id": "uma.ondc.in",
    "bap_uri": "https://api.uma.com",
    "transaction_id": "txn-uuid",
    "message_id": "msg-uuid",
    "timestamp": "2023-11-10T07:09:12.250Z"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "start": {
          "location": {
            "gps": "13.3501,74.7949"
          }
        },
        "end": {
          "location": {
            "gps": "13.3560,74.7860"
          }
        }
      }
    }
  }
}

// Callback (from BPP)
POST https://api.uma.com/api/ondc/on_search
{
  "context": { ... },
  "message": {
    "catalog": {
      "bpp/providers": [
        {
          "id": "namma-yatri-provider",
          "items": [
            {
              "id": "auto-123",
              "price": {
                "value": "150",
                "currency": "INR"
              }
            }
          ]
        }
      ]
    }
  }
}
```

### 2. Select Flow

**Objective**: Select a specific ride option

```javascript
// Request
POST https://gateway.ondc.org/select
{
  "context": {
    "action": "select",
    ...
  },
  "message": {
    "order": {
      "items": [
        {
          "id": "auto-123"
        }
      ]
    }
  }
}

// Callback
POST https://api.uma.com/api/ondc/on_select
{
  "message": {
    "order": {
      "items": [...],
      "quote": {
        "price": {
          "value": "150"
        }
      }
    }
  }
}
```

### 3. Init Flow

**Objective**: Initialize order with customer details

```javascript
// Request
POST https://gateway.ondc.org/init
{
  "context": { ... },
  "message": {
    "order": {
      "items": [{ "id": "auto-123" }],
      "fulfillments": [
        {
          "customer": {
            "person": {
              "name": "John Doe"
            },
            "contact": {
              "phone": "+919876543210"
            }
          }
        }
      ]
    }
  }
}

// Callback
POST https://api.uma.com/api/ondc/on_init
{
  "message": {
    "order": {
      "payment": {
        "type": "ON-FULFILLMENT",
        "collected_by": "BPP"
      }
    }
  }
}
```

### 4. Confirm Flow

**Objective**: Confirm the booking

```javascript
// Request
POST https://gateway.ondc.org/confirm
{
  "context": { ... },
  "message": {
    "order": {
      "id": "order-uuid"
    }
  }
}

// Callback
POST https://api.uma.com/api/ondc/on_confirm
{
  "message": {
    "order": {
      "id": "order-uuid",
      "state": "CONFIRMED",
      "fulfillments": [
        {
          "agent": {
            "name": "Driver Name",
            "phone": "+919876543210"
          },
          "vehicle": {
            "registration": "KA01AB1234"
          }
        }
      ]
    }
  }
}
```

### 5. Status Flow

**Objective**: Get real-time order status

```javascript
// Request
POST https://gateway.ondc.org/status
{
  "context": { ... },
  "message": {
    "order_id": "order-uuid"
  }
}

// Callback
POST https://api.uma.com/api/ondc/on_status
{
  "message": {
    "order": {
      "state": "IN_PROGRESS",
      "fulfillments": [
        {
          "state": {
            "descriptor": {
              "code": "AGENT_ASSIGNED"
            }
          }
        }
      ]
    }
  }
}
```

## BPP Partners

### Namma Yatri

**Type**: Auto-rickshaw mobility
**Business Model**: SaaS fee from drivers (₹25/day)
**Why they want us**: More rides = stickier SaaS product

**Integration:**
```javascript
const nammaYatriConfig = {
  bppId: 'namma-yatri.in',
  bppUri: 'https://api.nammayatri.in',
  domain: 'nic2004:60212',
  serviceType: 'auto-rickshaw'
};
```

### Chalo

**Type**: Public transport (bus, metro)
**Use case**: Multi-modal missions

**Integration:**
```javascript
const chaloConfig = {
  bppId: 'chalo.in',
  bppUri: 'https://api.chalo.in',
  domain: 'nic2004:60212',
  serviceType: 'public-transport'
};
```

### Magicpin

**Type**: Food & Beverage commerce
**Use case**: Cross-domain mission bundling

**Integration:**
```javascript
const magicpinConfig = {
  bppId: 'magicpin.in',
  bppUri: 'https://api.magicpin.in',
  domain: 'nic2004:52110',
  serviceType: 'food-beverage'
};
```

## Implementation Details

### ONDCGatewayService

Located in `packages/backend/src/services/ondc-gateway.service.ts`

**Key Methods:**

```typescript
class ONDCGatewayService {
  // Search for rides
  async search(params: SearchParams): Promise<SearchResponse>
  
  // Select a ride
  async select(params: SelectParams): Promise<SelectResponse>
  
  // Initialize order
  async init(params: InitParams): Promise<InitResponse>
  
  // Confirm booking
  async confirm(params: ConfirmParams): Promise<ConfirmResponse>
  
  // Get status
  async status(params: StatusParams): Promise<StatusResponse>
  
  // Handle callbacks
  async handleCallback(action: string, payload: any): Promise<void>
}
```

### Context Generation

Every ONDC request needs a context:

```typescript
private createContext(action: string): ONDCContext {
  return {
    domain: 'nic2004:60212',
    country: 'IND',
    city: 'std:080',
    action: action,
    core_version: '1.0.0',
    bap_id: this.bapId,
    bap_uri: this.bapUri,
    transaction_id: uuidv4(),
    message_id: uuidv4(),
    timestamp: new Date().toISOString()
  };
}
```

### Callback Handling

Callbacks are async:

```typescript
// Express routes for callbacks
router.post('/on_search', onSearch);
router.post('/on_select', onSelect);
router.post('/on_init', onInit);
router.post('/on_confirm', onConfirm);
router.post('/on_status', onStatus);

// Handler
export const onSearch = async (req: Request, res: Response) => {
  await ondcService.handleCallback('on_search', req.body);
  res.status(200).json({ 
    message: { ack: { status: 'ACK' } } 
  });
};
```

## Testing

### Staging Environment

ONDC provides staging environment:

```env
ONDC_GATEWAY_URL=https://staging-gateway.ondc.org
ONDC_BAP_ID=uma-staging.ondc.in
```

### Mock BPP

For local testing, create mock BPP responses:

```typescript
// tests/mocks/ondc-responses.ts
export const mockSearchResponse = {
  context: { ... },
  message: {
    catalog: {
      bpp/providers: [...]
    }
  }
};
```

### Integration Tests

```typescript
describe('ONDC Integration', () => {
  it('should complete full booking flow', async () => {
    // 1. Search
    const searchResult = await ondcService.search({
      pickupLocation: { lat: 13.35, lng: 74.79 },
      dropLocation: { lat: 13.36, lng: 74.78 }
    });
    
    // 2. Select
    const selectResult = await ondcService.select({
      transactionId: searchResult.transactionId,
      bppId: 'namma-yatri.in',
      itemId: 'auto-123'
    });
    
    // 3. Init
    const initResult = await ondcService.init({
      transactionId: searchResult.transactionId,
      customerDetails: {
        name: 'Test User',
        phone: '+919876543210'
      }
    });
    
    // 4. Confirm
    const confirmResult = await ondcService.confirm({
      transactionId: searchResult.transactionId,
      orderId: initResult.orderId
    });
    
    expect(confirmResult.status).toBe('CONFIRMED');
  });
});
```

## Security

### Request Signing

ONDC requires request signing:

```typescript
import crypto from 'crypto';

function signRequest(payload: any, privateKey: string): string {
  const sign = crypto.createSign('SHA256');
  sign.update(JSON.stringify(payload));
  return sign.sign(privateKey, 'base64');
}
```

### Callback Verification

Verify callback authenticity:

```typescript
function verifyCallback(payload: any, signature: string): boolean {
  const verify = crypto.createVerify('SHA256');
  verify.update(JSON.stringify(payload));
  return verify.verify(bppPublicKey, signature, 'base64');
}
```

## Best Practices

1. **Always use transaction_id** for request correlation
2. **Handle callbacks asynchronously** - don't block
3. **Cache BPP responses** in MongoDB
4. **Implement timeouts** - ONDC can be slow
5. **Log everything** - for debugging
6. **Use idempotency keys** - prevent duplicates
7. **Monitor callback latency** - optimize UX

## Troubleshooting

### Common Issues

**Issue**: Callbacks not received
**Solution**: Check callback URL is publicly accessible

**Issue**: Invalid signature errors
**Solution**: Verify private key and signing algorithm

**Issue**: BPP timeout
**Solution**: Implement retry logic with exponential backoff

**Issue**: Context validation failed
**Solution**: Ensure all required context fields are present

## Resources

- [ONDC Official Docs](https://ondc.org)
- [ONDC GitHub](https://github.com/ONDC-Official)
- [UMA API Docs](./API.md)
- [UMA Architecture](./ARCHITECTURE.md)

## Support

For ONDC integration issues:
- Email: ondc@uma.com
- Slack: #ondc-integration

---

**Last Updated**: November 2023
