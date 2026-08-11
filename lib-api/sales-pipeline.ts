
// GraphQL Types
export interface SalesPipelineNode {
  id: string;
  value: number;
  estimatedCloseDate: string;
  paxName: string;
  picName: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
}

export interface SalesPipelineEdge {
  cursor: string;
  node: SalesPipelineNode;
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface SalesPipelinesResponse {
  data: {
    salesPipelines: {
      edges: SalesPipelineEdge[];
      pageInfo: PageInfo;
    };
  };
  errors?: Array<{ message: string }>;
}

export async function loadSalesPipeline(
  first: number = 10,
  after?: string
): Promise<SalesPipelinesResponse> {
  try {
    // Use Next.js API route as proxy to avoid CORS issues
    // Include basePath to match Next.js configuration
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const API_ROUTE = `${basePath}/api/graphql`;
    
    const query = `
      query SalesPipelines($first: Int!, $after: String, $orderBy: SalesPipelineOrder) {
        salesPipelines(first: $first, after: $after, orderBy: $orderBy) {
          edges {
            cursor
            node {
              id
              value
              estimatedCloseDate
              paxName
              picName
              createdAt
              createdBy
              updatedAt
              updatedBy
              isActive
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `;

    const variables = {
      first,
      after: after || null,
      orderBy: { createdAt: 'ASC' }
    };

    const response = await fetch(API_ROUTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON response but received: ${contentType}. Response: ${text.substring(0, 200)}`);
    }

    const result: SalesPipelinesResponse = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'GraphQL error occurred');
    }

    return result;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }
    throw error;
  }
}