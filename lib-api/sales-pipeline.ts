
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
      query SalesPipelines {
        salesPipelines(first: 10, after: "1", orderBy: { createdAt: ASC }) {
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

    const variables: any = {
      first,
      orderBy: { createdAt: 'ASC' }
    };
    
    // Only include 'after' if it has a value
    if (after) {
      variables.after = after;
    }

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

    // Always try to parse the JSON response first
    const result: SalesPipelinesResponse = await response.json();
    
    if (!response.ok) {
      console.error('API error response:', result);
      const errorMessage = result.errors?.[0]?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }
    
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