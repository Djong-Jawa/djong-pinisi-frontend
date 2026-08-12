import React from 'react';
import GeneralFunction from '../generals/gengeral-function';

export interface SalesPipelineCardProps {
  lead: {
    id: number;
    name: string;
    paxname: string;
    stage: 'Initial Contact' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
    value: number;
    closeDate?: string;
    comment: string;
    history: {
      stage: string;
      date: string;
      comment: string;
    }[];
  };
  onClick: () => void;
}

const SalesPipelineCard: React.FC<SalesPipelineCardProps> = ({ lead, onClick }) => {

  const gf = new GeneralFunction();
  
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Initial Contact':
        return 'bg-blue-200 text-blue-800';
      case 'Qualification':
        return 'bg-yellow-200 text-yellow-800';
      case 'Proposal':
        return 'bg-indigo-200 text-indigo-800';
      case 'Negotiation':
        return 'bg-purple-200 text-purple-800';
      case 'Closed Won':
        return 'bg-green-200 text-green-800';
      case 'Closed Lost':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{lead.name}</h3>
        <p className="text-sm text-gray-600">{lead.paxname}</p>
      </div>
      <div className="flex items-center mt-4 sm:mt-0">
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStageColor(lead.stage)}`}>
          {lead.stage}
        </div>
        <div className="ml-4 text-right">
          <p className="text-lg font-bold text-gray-800">{Number(lead.value).toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR'
          })}</p>
          <p className="text-xs text-gray-500">Est. Close: {gf.formatDateTime(new Date(lead.closeDate))}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesPipelineCard;