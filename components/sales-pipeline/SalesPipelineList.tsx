'use client'

import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SalesPipelineCard from './SalesPipelineCard';
import SalesPipelineControls from './SalesPipelineControls';
import Pagination from '../generals/Pagination';
import SalesPipelineDetailModal from './SalesPipelineDetailModal';
import SalesPipelineInputModal from './SalesPipelineInputModal';
import { RootState } from '../../store/store';
import {
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
  setIsLoading,
  setError,
  setSalesData,
} from '../../store/features/sales-pipeline/salesPipelineSlice';
import { loadSalesPipeline, SalesPipelineNode } from '@/lib-api/sales-pipeline';
import { SalesPipelineCardProps } from './SalesPipelineCard';

const SalesPipelineList: React.FC = () => {
  const dispatch = useDispatch();
  const {
    currentPage,
    selectedLead,
    isInputModalOpen,
    paginatedData,
    filteredAndSortedData,
    itemsPerPage,
    isLoading,
    error
  } = useSelector((state: RootState) => state.salesPipeline);

  // const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  // Fetch sales pipeline data on component mount
  useEffect(() => {
    const fetchSalesPipeline = async () => {
      dispatch(setIsLoading(true));
      
      try {
        const response = await loadSalesPipeline(10);
        
        // Map GraphQL response to component data structure
        const mappedData: SalesPipelineCardProps['lead'][] = response.data.salesPipelines.edges.map((edge) => {
          const node = edge.node;
          return {
            id: parseInt(node.id),
            name: node.picName,
            paxname: node.paxName,
            stage: 'Initial Contact', // Map this based on your business logic
            value: node.value,
            closeDate: node.estimatedCloseDate,
            comment: '', // Add if available in API
            history: [] // Add if available in API
          };
        });
        
        dispatch(setSalesData({
          data: mappedData,
          endCursor: response.data.salesPipelines.pageInfo.endCursor,
          hasNextPage: response.data.salesPipelines.pageInfo.hasNextPage
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load sales pipeline';
        dispatch(setError(errorMessage));
        console.error('Error loading sales pipeline:', err);
      }
    };

    fetchSalesPipeline();
  }, [dispatch]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <SalesPipelineControls
        onSearch={(query) => dispatch(setSearchQuery(query))}
        onFilter={(stage) => dispatch(setFilterStage(stage))}
        onSort={(order) => dispatch(setSortOrder(order))}
        openInputModal={() => dispatch(setIsInputModalOpen(true))}
      />
      
      {isInputModalOpen && (
        <SalesPipelineInputModal 
          onClose={() => dispatch(setIsInputModalOpen(false))}
          lead={{
            id: 0,
            name: '',
            paxname: '',
            stage: 'Initial Contact',
            value: 0,
            closeDate: '',
            comment: '',
            history: []
          }}
          onChangeLeadsValue={(value) => dispatch(setLeadValue(value))}
          onChangePaxName={(paxname) => dispatch(setLeadPaxName(paxname))}
          onChangePIC={(pic) => dispatch(setLeadPIC(pic))}
          onSelectStatus={(stage) => dispatch(setLeadStage(stage))}
          onSubmit={() => dispatch(setIsModalInputLoading(true))}
        />
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading sales pipeline...</div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Data Display */}
      {!isLoading && !error && paginatedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No sales pipeline data found.
        </div>
      )}
      
      {!isLoading && !error && paginatedData.map((lead) => (
        <SalesPipelineCard 
          key={lead.id} 
          lead={lead} 
          onClick={() => dispatch(setSelectedLead(lead))} 
        />
      ))}
      
      {selectedLead && (
        <SalesPipelineDetailModal 
          lead={selectedLead} 
          onClose={() => dispatch(setSelectedLead(null))} 
        />
      )}
      
      {!isLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
        />
      )}
    </div>
  );
};

export default SalesPipelineList;
