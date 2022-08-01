import React, { useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { PencilIcon, TrashIcon, DownloadIcon, UploadIcon } from '@heroicons/react/outline';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu from '../../../../components/popover-menu/PopoverMenu';
import { useSelectedOrganization } from '../../../../store/selectors';
import { Report } from '../../interfaces/Report.interface';
import { ReportsTableHeaders } from './table-headers/ReportsTable.headers';
import { PartnerTableHeaders } from './table-headers/PartnerTable.headers';
import { Investor } from '../../interfaces/Investor.interface';
import { Partner } from '../../interfaces/Partner.interface';
import { InvestorsTableHeaders } from './table-headers/InvestorTable.headers';
import ReportSummaryModal from './components/ReportSummaryModal';
import CardPanel from '../../../../components/card-panel/CardPanel';
import { getInvestorsTemplate, getPartnersTemplate } from '../../../../services/files/File.service';
import {
  useDeleteInvestorsList,
  useOrganizationMutation,
  useUploadInvestorsList,
  useUploadPartnersList,
} from '../../../../services/organization/Organization.queries';
import { useErrorToast } from '../../../../common/hooks/useToast';
import readXlsxFile from 'read-excel-file';

const OrganizationData = () => {
  const [isActivitySummartModalOpen, setIsActivitySummaryModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [investorsLink, setInvestorsLink] = useState<string>('');
  const [partnersLink, setPartnersLink] = useState<string>('');
  const { organizationReport } = useSelectedOrganization();
  const { mutate, error, isLoading } = useOrganizationMutation();
  const partnersMutation = useUploadPartnersList();
  const investorsMutation = useUploadInvestorsList();
  const deleteInvestorMutation = useDeleteInvestorsList();

  useEffect(() => {
    initTemplateData();
  }, []);

  useEffect(() => {
    if (error) useErrorToast('Could not load open data');
  }, [error]);

  const initTemplateData = async () => {
    setInvestorsLink(await getInvestorsTemplate());
    setPartnersLink(await getPartnersTemplate());
  };

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

  const buildPartnersActionColumn = (): TableColumn<Partner> => {
    const menuItems = [
      {
        name: 'Descarca lista',
        icon: DownloadIcon,
        onClick: onSelectPartnerRow,
        downloadProp: 'link',
        isDownload: true,
      },
      {
        name: 'Incarca lista noua',
        icon: UploadIcon,
        onClick: onSelectPartnerRow,
        isUpload: true,
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
      cell: (row: Partner) => <PopoverMenu row={row} menuItems={menuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  const buildInvestorsActionColumn = (): TableColumn<Investor> => {
    const menuItems = [
      {
        name: 'Descarca lista',
        icon: DownloadIcon,
        onClick: onSelectInvestorRow,
        downloadProp: 'link',
        isDownload: true,
      },
      {
        name: 'Incarca lista noua',
        icon: UploadIcon,
        onClick: onSelectInvestorRow,
        isUpload: true,
      },
      {
        name: 'Elimina lista',
        icon: TrashIcon,
        onClick: onDeleteInvestor,
        isRemove: true,
      },
    ];

    return {
      name: '',
      cell: (row: Investor) => <PopoverMenu row={row} menuItems={menuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  const onEditReport = (row: Report) => {
    setSelectedReport(row);
    setIsActivitySummaryModalOpen(true);
  };

  const onSaveReport = (data: {
    report: string;
    numberOfContractors: number;
    numberOfVolunteers: number;
  }) => {
    setIsActivitySummaryModalOpen(false);
    mutate({
      id: 2,
      organization: {
        report: {
          reportId: selectedReport?.id as number,
          ...data,
        },
      },
    });
  };

  const onDeleteReport = (row: Report) => {
    mutate({
      id: 2,
      organization: {
        report: {
          reportId: row.id,
        },
      },
    });
  };

  const onSelectPartnerRow = (row: Partner) => {
    setSelectedPartner(row);
  };

  const onDeletePartner = (row: Partner) => {
    console.log('on delete partner', row);
  };

  const onSelectInvestorRow = (row: Investor) => {
    setSelectedInvestor(row);
  };

  const onDeleteInvestor = (row: Investor) => {
    deleteInvestorMutation.mutate({ id: 2, investorId: row.id });
  };

  const onChangeFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (selectedPartner) {
        const rows = await readXlsxFile(event.target.files[0]);
        const numberOfPartners = rows.length > 2 ? rows.length - 2 : 0;

        if (numberOfPartners === 0) {
          return;
        }

        const data = new FormData();
        data.append('partners', event.target.files[0]);
        data.append('numberOfPartners', numberOfPartners.toString());
        partnersMutation.mutate({ id: 2, partnerId: selectedPartner.id, data });
      }

      if (selectedInvestor) {
        const rows = await readXlsxFile(event.target.files[0]);
        const numberOfInvestors = rows.length > 2 ? rows.length - 2 : 0;

        if (numberOfInvestors === 0) {
          return;
        }

        const data = new FormData();
        data.append('investors', event.target.files[0]);
        data.append('numberOfInvestors', numberOfInvestors.toString());
        investorsMutation.mutate({ id: 2, investorId: selectedInvestor.id, data });
      }
    }
    event.target.value = '';
    setSelectedPartner(null);
    setSelectedInvestor(null);
  };

  return (
    <div className="flex flex-col gap-y-6">
      <CardPanel title="Sumar">
        <>
          <div className="pt-1 pb-6">
            <p className="text-base font-normal text-gray-900">
              Te rugam sa actualizezi datele din aceasta sectiune la un interval stabilit de timp.
            </p>
          </div>
          <DataTableComponent
            columns={[...ReportsTableHeaders, buildReportActionColumn()]}
            data={organizationReport?.reports || []}
            loading={isLoading}
          />
        </>
      </CardPanel>
      <CardPanel title="Parteneri">
        <>
          <div className="pt-1 pb-6">
            <p className="text-base font-normal text-gray-900 flex">
              Te rugam sa actualizezi datele din aceasta sectiune la un interval stabilit de timp.
              <a
                href={partnersLink}
                className="text-green-500 flex align-middle justify-center ml-2 cursor-pointer"
                download
              >
                <DownloadIcon className="w-5 h-5" />
                Descarca model de tabel parteneri
              </a>
            </p>
          </div>
          <DataTableComponent
            columns={[...PartnerTableHeaders, buildPartnersActionColumn()]}
            data={organizationReport?.partners || []}
            loading={partnersMutation.isLoading}
          />
        </>
      </CardPanel>
      <CardPanel title="Finantatori">
        <>
          <div className="pt-1 pb-6">
            <p className="text-base font-normal text-gray-900 flex">
              Te rugam sa actualizezi datele din aceasta sectiune la un interval stabilit de timp.
              <a
                href={investorsLink}
                className="text-green-500 flex align-middle justify-center ml-2 cursor-pointer"
                download
              >
                <DownloadIcon className="w-5 h-5" />
                Descarca model de tabel finantatori
              </a>
            </p>
          </div>
          <DataTableComponent
            columns={[...InvestorsTableHeaders, buildInvestorsActionColumn()]}
            data={organizationReport?.investors || []}
            loading={investorsMutation.isLoading || deleteInvestorMutation.isLoading}
          />
        </>
      </CardPanel>
      <input className="w-0 h-0" id="upload" name="upload" type="file" onChange={onChangeFile} />
      {isActivitySummartModalOpen && selectedReport && (
        <ReportSummaryModal
          onClose={setIsActivitySummaryModalOpen.bind(null, false)}
          defaultValue={selectedReport}
          onSave={onSaveReport}
          year={selectedReport.year}
        />
      )}
    </div>
  );
};

export default OrganizationData;
