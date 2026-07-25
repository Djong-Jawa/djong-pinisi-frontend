import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SalesPipelineCardProps } from '../../../_components/sales-pipeline/SalesPipelineCard';

interface SalesPipelineState {
  searchQuery: string;
  filterStage: string;
  sortOrder: string;
  currentPage: number;
  selectedLead: SalesPipelineCardProps['lead'] | null;
  leadValue: string;
  leadpaxname: string;
  leadPIC: string;
  leadStage: string;
  salesData: SalesPipelineCardProps['lead'][];
  filteredAndSortedData: SalesPipelineCardProps['lead'][];
  paginatedData: SalesPipelineCardProps['lead'][];
  itemsPerPage: number;
  
  // Modal State
  isInputModalOpen: boolean;
  isModalInputLoading: boolean;
}

const sampleData: SalesPipelineCardProps['lead'][] = [
  {
    id: 1,
    name: "John Smith",
    paxname: "Bali Adventures Ltd",
    stage: "Initial Contact",
    value: 15000,
    closeDate: "2025-10-15",
    comment: "Interested in custom tour packages for 30 pax",
    history: [
      {
        stage: "Initial Contact",
        date: "2025-09-10",
        comment: "First contact via website inquiry"
      }
    ]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    paxname: "Singapore Travel Group",
    stage: "Qualification",
    value: 45000,
    closeDate: "2025-11-01",
    comment: "Looking for luxury cruise packages",
    history: [
      {
        stage: "Initial Contact",
        date: "2025-09-01",
        comment: "Initial meeting at trade show"
      },
      {
        stage: "Qualification",
        date: "2025-09-08",
        comment: "Budget confirmed, checking availability"
      }
    ]
  },
  {
    id: 3,
    name: "Michael Chen",
    paxname: "Asian Tours Co",
    stage: "Proposal",
    value: 75000,
    closeDate: "2025-10-30",
    comment: "Proposal for corporate retreat - 50 pax",
    history: [
      {
        stage: "Initial Contact",
        date: "2025-08-15",
        comment: "Email inquiry for corporate event"
      },
      {
        stage: "Qualification",
        date: "2025-08-25",
        comment: "Requirements gathering call"
      },
      {
        stage: "Proposal",
        date: "2025-09-05",
        comment: "Detailed proposal sent"
      }
    ]
  },
  {
    id: 4,
    name: "Emily Davis",
    paxname: "Luxury Escapes",
    stage: "Negotiation",
    value: 95000,
    closeDate: "2025-09-30",
    comment: "Final pricing discussion for premium package",
    history: [
      {
        stage: "Initial Contact",
        date: "2025-08-01",
        comment: "Referral from existing client"
      },
      {
        stage: "Qualification",
        date: "2025-08-10",
        comment: "Detailed requirements gathered"
      },
      {
        stage: "Proposal",
        date: "2025-08-20",
        comment: "Initial proposal submitted"
      },
      {
        stage: "Negotiation",
        date: "2025-09-01",
        comment: "Price negotiation started"
      }
    ]
  },
  {
    id: 5,
    name: "Robert Wilson",
    paxname: "Corporate Events International",
    stage: "Closed Won",
    value: 120000,
    closeDate: "2025-09-05",
    comment: "Contract signed for December event",
    history: [
      {
        stage: "Initial Contact",
        date: "2025-07-01",
        comment: "LinkedIn connection request"
      },
      {
        stage: "Qualification",
        date: "2025-07-15",
        comment: "Initial meeting and requirements"
      },
      {
        stage: "Proposal",
        date: "2025-07-30",
        comment: "Comprehensive proposal delivered"
      },
      {
        stage: "Negotiation",
        date: "2025-08-15",
        comment: "Terms discussion"
      },
      {
        stage: "Closed Won",
        date: "2025-09-05",
        comment: "Deal finalized and signed"
      }
    ]
  },
  {
    id: 6,
    name: "Lisa Wong",
    paxname: "Travel Masters",
    stage: "Closed Lost",
    value: 25000,
    closeDate: "2025-09-01",
    comment: "Lost to competitor due to pricing",
    history: [
      {
        stage: "Initial Contact",
        date: "2025-07-20",
        comment: "Website inquiry"
      },
      {
        stage: "Qualification",
        date: "2025-07-25",
        comment: "Budget discussion"
      },
      {
        stage: "Proposal",
        date: "2025-08-01",
        comment: "Proposal sent"
      },
      {
        stage: "Closed Lost",
        date: "2025-09-01",
        comment: "Client chose another provider"
      }
    ]
  }
];

const initialState: SalesPipelineState = {
  searchQuery: '',
  filterStage: '',
  sortOrder: 'value-desc',
  currentPage: 1,
  selectedLead: null,
  isInputModalOpen: false,
  isModalInputLoading: false,
  leadValue: '',
  leadpaxname: '',
  leadPIC: '',
  leadStage: 'Initial Contact',
  salesData: sampleData,
  filteredAndSortedData: sampleData,
  paginatedData: sampleData.slice(0, 5),
  itemsPerPage: 5
};

const salesPipelineSlice = createSlice({
  name: 'salesPipeline',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      updateFilteredAndSortedData(state);
      updatePaginatedData(state);
    },

    // Filter State
    setFilterStage: (state, action: PayloadAction<string>) => {
      state.filterStage = action.payload;
      state.currentPage = 1;
      updateFilteredAndSortedData(state);
      updatePaginatedData(state);
    },

    // Sort State
    setSortOrder: (state, action: PayloadAction<string>) => {
      state.sortOrder = action.payload;
      updateFilteredAndSortedData(state);
      updatePaginatedData(state);
    },

    // Pagination State
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
      updatePaginatedData(state);
    },

    // Selected Lead for Detail Modal
    setSelectedLead: (state, action: PayloadAction<SalesPipelineCardProps['lead'] | null>) => {
      state.selectedLead = action.payload;
    },

    // Input Modal State
    setIsInputModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isInputModalOpen = action.payload;
    },

    // Lead Value
    setLeadValue: (state, action: PayloadAction<string>) => {
      state.leadValue = action.payload;
    },

    // Lead Pax Name
    setLeadPaxName: (state, action: PayloadAction<string>) => {
      state.leadpaxname = action.payload;
    },

    // Lead PIC
    setLeadPIC: (state, action: PayloadAction<string>) => {
      state.leadPIC = action.payload;
    },

    // Lead Stage
    setLeadStage: (state, action: PayloadAction<string>) => {
      state.leadStage = action.payload;
    },

    // setLoading
    setIsModalInputLoading: (state, action: PayloadAction<boolean>) => {
      state.isModalInputLoading = action.payload;
    },
  }
});

// Helper functions for state updates
const updateFilteredAndSortedData = (state: SalesPipelineState) => {
  let filteredData = state.salesData;

  if (state.searchQuery) {
    filteredData = filteredData.filter(lead =>
      lead.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      lead.paxname.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }

  if (state.filterStage) {
    filteredData = filteredData.filter(lead => lead.stage === state.filterStage);
  }

  const [sortBy, order] = state.sortOrder.split('-');
  state.filteredAndSortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'value') {
      return order === 'asc' ? a.value - b.value : b.value - a.value;
    }
    if (sortBy === 'closeDate') {
      return order === 'asc'
        ? new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime()
        : new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime();
    }
    return 0;
  });
};

const updatePaginatedData = (state: SalesPipelineState) => {
  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  state.paginatedData = state.filteredAndSortedData.slice(
    startIndex,
    startIndex + state.itemsPerPage
  );
};

export const {
  setSearchQuery,
  setFilterStage,
  setSortOrder,
  setCurrentPage,
  setSelectedLead,
  setIsInputModalOpen,
  setLeadValue,
  setLeadPaxName,
  setLeadPIC,
  setLeadStage,
  setIsModalInputLoading,
} = salesPipelineSlice.actions;

export default salesPipelineSlice.reducer;