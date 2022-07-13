import React, { useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { PencilIcon, TrashIcon, DownloadIcon, UploadIcon } from '@heroicons/react/outline';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu from '../../../../components/popover-menu/PopoverMenu';
import { useSelectedOrganization } from '../../../../store/selectors';
import { Report } from '../../interfaces/Report.interface';
import { ReportsTableHeaders } from './ReportsTable.headers';
import { PartnerTableHeaders } from './PartnerTable.headers';
import { Investor } from '../../interfaces/Investor.interface';
import { Partner } from '../../interfaces/Partner.interface';
import { InvestorsTableHeaders } from './InvestorTable.headers';
import ReportSummaryModal from './components/ReportSummaryModal';

interface CardTableProps {
  title: string;
  children?: JSX.Element;
}

const CardTable = ({ title, children }: CardTableProps) => {
  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">{title}</span>
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="md:py-5 md:px-10 sm:p-10">
        <div className="pt-1 pb-6">
          <p className="text-base font-normal text-gray-900">
            Te rugam sa actualizezi datele din aceasta sectiune la un interval stabilit de timp.
          </p>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

const OrganizationData = () => {
  const [isActivitySummartModalOpen, setIsActivitySummaryModalOpen] = useState<boolean>(false);
  const { organizationReport } = useSelectedOrganization();

  const buildReportActionColumn = (): TableColumn<Report> => {
    const menuItems = [
      {
        name: 'edit',
        icon: PencilIcon,
        onClick: onEditReport,
      },
      {
        name: 'Elimina date',
        icon: TrashIcon,
        onClick: onDeleteReport,
        isRemove: true,
      },
    ];

    return {
      name: '',
      cell: (row: Report) => <PopoverMenu row={row} menuItems={menuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  const buildPartnersInvestorsActionColumn = (): TableColumn<Investor | Partner> => {
    const menuItems = [
      {
        name: 'Descarca lista',
        icon: DownloadIcon,
        onClick: onDownloadPartner,
      },
      {
        name: 'Incarca lista noua',
        icon: UploadIcon,
        onClick: onUploadPartner,
      },
      {
        name: 'Elimina lista',
        icon: TrashIcon,
        onClick: onDeletePartner,
        isRemove: true,
      },
    ];

    return {
      name: '',
      cell: (row: Investor | Partner) => <PopoverMenu row={row} menuItems={menuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  const onEditReport = (row: Report) => {
    console.log('edit row');
    setIsActivitySummaryModalOpen(true);
  };

  const onDeleteReport = (row: Report) => {
    console.log('report row delete', row);
  };

  const onDeletePartner = (row: Partner) => {
    console.log('on delete partner', row);
  };

  const onUploadPartner = (row: Partner) => {
    console.log('on upload partner', row);
  };

  const onDownloadPartner = (row: Partner) => {
    console.log('on download partner', row);
  };

  return (
    <div className="flex flex-col gap-y-6">
      <CardTable title="Sumar">
        <DataTableComponent
          columns={[...ReportsTableHeaders, buildReportActionColumn()]}
          data={organizationReport?.reports || []}
        />
      </CardTable>
      <CardTable title="Parteneri">
        <DataTableComponent
          columns={[...PartnerTableHeaders, buildPartnersInvestorsActionColumn()]}
          data={organizationReport?.partners || []}
        />
      </CardTable>
      <CardTable title="Finantatori">
        <DataTableComponent
          columns={[...InvestorsTableHeaders, buildPartnersInvestorsActionColumn()]}
          data={organizationReport?.inverstors || []}
        />
      </CardTable>
      {isActivitySummartModalOpen && (
        <ReportSummaryModal
          onClose={() => setIsActivitySummaryModalOpen(false)}
          year={new Date().getFullYear()}
        />
      )}
    </div>
  );
};

export default OrganizationData;
