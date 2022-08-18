import React, { useContext, useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { PencilIcon, TrashIcon, DownloadIcon, UploadIcon } from '@heroicons/react/outline';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import { useSelectedOrganization } from '../../../../store/selectors';
import { Report } from '../../interfaces/Report.interface';
import { ReportsTableHeaders } from './table-headers/ReportsTable.headers';
import { PartnerTableHeaders } from './table-headers/PartnerTable.headers';
import { Investor } from '../../interfaces/Investor.interface';
import { Partner } from '../../interfaces/Partner.interface';
import { InvestorsTableHeaders } from './table-headers/InvestorTable.headers';
import ReportSummaryModal from './components/ReportSummaryModal';
import CardPanel from '../../../../components/card-panel/CardPanel';
import {
  getInvestorsTemplate,
  getPartnersTemplate,
  getPublicFileUrl,
} from '../../../../services/files/File.service';
import {
  useDeleteInvestorByProfileMutation,
  useDeletePartnerByProfileMutation,
  useOrganizationByProfileMutation,
  useUploadInvestorsByProfileList,
  useUploadPartnersListByProfile,
} from '../../../../services/organization/Organization.queries';
import { useErrorToast } from '../../../../common/hooks/useToast';
import readXlsxFile from 'read-excel-file';
import { triggerDownload } from '../../../../common/helpers/utils.helper';
import { AuthContext } from '../../../../contexts/AuthContext';
import { UserRole } from '../../../users/enums/UserRole.enum';

const OrganizationData = () => {
  // static links for partners and investors tables
  const [investorsLink, setInvestorsLink] = useState<string>('');
  const [partnersLink, setPartnersLink] = useState<string>('');

  const [isActivitySummaryModalOpen, setIsActivitySummaryModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const { role } = useContext(AuthContext);

  const { organizationReport } = useSelectedOrganization();
  const {
    mutate: updateReport,
    error: updateReportError,
    isLoading: updateReportPending,
  } = useOrganizationByProfileMutation();
  const {
    mutate: uploadPartners,
    error: uploadPartnersError,
    isLoading: uploadPartnersPending,
  } = useUploadPartnersListByProfile();
  const {
    mutate: uploadInvestors,
    error: uploadInvestorsError,
    isLoading: uploadInvestorsPending,
  } = useUploadInvestorsByProfileList();
  const {
    mutate: deleteInvestor,
    error: deleteInvestorError,
    isLoading: deleteInvestorPending,
  } = useDeleteInvestorByProfileMutation();
  const {
    mutate: deletePartner,
    error: deletePartnerError,
    isLoading: deletePartnerPending,
  } = useDeletePartnerByProfileMutation();

  useEffect(() => {
    initTemplateData();
  }, []);

  useEffect(() => {
    if (
      updateReportError ||
      uploadPartnersError ||
      uploadInvestorsError ||
      deleteInvestorError ||
      deletePartnerError
    )
      useErrorToast('Could not load open data');
  }, [
    updateReportError,
    uploadPartnersError,
    uploadInvestorsError,
    deleteInvestorError,
    deletePartnerError,
  ]);

  const initTemplateData = async () => {
    setInvestorsLink(await getInvestorsTemplate());
    setPartnersLink(await getPartnersTemplate());
  };

  const buildReportActionColumn = (): TableColumn<Report> => {
    const menuItems = [
      {
        name: 'Editeaza',
        icon: PencilIcon,
        onClick: onEditReport,
      },
      {
        name: 'Elimina date',
        icon: TrashIcon,
        onClick: onDeleteReport,
        type: PopoverMenuRowType.REMOVE,
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
    const employeeMenuItems = [
      {
        name: 'Descarca lista',
        icon: DownloadIcon,
        onClick: onDownloadFile,
        type: PopoverMenuRowType.DOWNLOAD,
      },
    ];

    const adminMenuItems = [
      {
        name: 'Descarca lista',
        icon: DownloadIcon,
        onClick: onDownloadFile,
        type: PopoverMenuRowType.DOWNLOAD,
      },
      {
        name: 'Incarca lista noua',
        icon: UploadIcon,
        onClick: setSelectedPartner,
        type: PopoverMenuRowType.UPLOAD,
      },
      {
        name: 'Elimina lista',
        icon: TrashIcon,
        onClick: onDeletePartner,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: Partner) => (
        <PopoverMenu
          row={row}
          menuItems={role === UserRole.EMPLOYEE ? employeeMenuItems : adminMenuItems}
        />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  const buildInvestorsActionColumn = (): TableColumn<Investor> => {
    const employeeMenuItems = [
      {
        name: 'Descarca lista',
        icon: DownloadIcon,
        onClick: onDownloadFile,
        isDownload: true,
      },
    ];

    const adminMenuItems = [
      {
        name: 'Descarca lista',
        icon: DownloadIcon,
        onClick: onDownloadFile,
        type: PopoverMenuRowType.DOWNLOAD,
      },
      {
        name: 'Incarca lista noua',
        icon: UploadIcon,
        onClick: setSelectedInvestor,
        type: PopoverMenuRowType.UPLOAD,
      },
      {
        name: 'Elimina lista',
        icon: TrashIcon,
        onClick: onDeleteInvestor,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: Investor) => (
        <PopoverMenu
          row={row}
          menuItems={role === UserRole.EMPLOYEE ? employeeMenuItems : adminMenuItems}
        />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  const onEditReport = (row: Report) => {
    setSelectedReport(row);
    setIsActivitySummaryModalOpen(true);
  };

  const onSaveReport = (data: Report) => {
    setIsActivitySummaryModalOpen(false);
    setSelectedReport(null);
    updateReport({
      organization: {
        report: {
          reportId: data.id,
          numberOfContractors: data.numberOfContractors ?? undefined,
          numberOfVolunteers: data.numberOfVolunteers ?? undefined,
          report: data.report || undefined,
        },
      },
    });
  };

  const onDeleteReport = (row: Report) => {
    updateReport({
      organization: {
        report: {
          reportId: row.id,
        },
      },
    });
  };

  const onDownloadFile = async (row: Partner | Investor) => {
    try {
      if (row.path) {
        const url = await getPublicFileUrl(row.path);
        triggerDownload(url);
      } else {
        useErrorToast('No file uploaded');
      }
    } catch (error) {
      useErrorToast('Could not download file');
    }
  };

  const onDeletePartner = (row: Partner) => {
    deletePartner({ partnerId: row.id });
  };

  const onDeleteInvestor = (row: Investor) => {
    deleteInvestor({ investorId: row.id });
  };

  const onUploadNewList = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (selectedPartner) uploadPartnersList(selectedPartner.id, event.target.files[0]);

      if (selectedInvestor) uploadInvestorsList(selectedInvestor.id, event.target.files[0]);
    }
    event.target.value = '';
  };

  const uploadPartnersList = async (partnerId: number, file: File) => {
    const rows = await readXlsxFile(file);
    if (rows.length <= 2) {
      useErrorToast('The file you uploaded contains no data!');
      return;
    }

    const data = new FormData();
    data.append('partners', file);
    data.append('numberOfPartners', (rows.length - 2).toString());
    uploadPartners({ partnerId, data });
    setSelectedPartner(null);
  };

  const uploadInvestorsList = async (investorId: number, file: File) => {
    const rows = await readXlsxFile(file);
    if (rows.length <= 2) {
      useErrorToast('The file you uploaded contains no data!');
      return;
    }

    const data = new FormData();
    data.append('investors', file);
    data.append('numberOfInvestors', (rows.length - 2).toString());
    uploadInvestors({ investorId, data });
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
            columns={
              role !== UserRole.EMPLOYEE
                ? [...ReportsTableHeaders, buildReportActionColumn()]
                : ReportsTableHeaders
            }
            data={organizationReport?.reports || []}
            loading={updateReportPending}
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
            loading={uploadPartnersPending || deletePartnerPending}
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
            loading={uploadInvestorsPending || deleteInvestorPending}
          />
        </>
      </CardPanel>
      <input
        className="w-0 h-0"
        id="upload"
        name="upload"
        type="file"
        accept=".xls,.xlsx"
        onChange={onUploadNewList}
      />
      {isActivitySummaryModalOpen && selectedReport && (
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
