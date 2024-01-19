import { DownloadIcon, PencilIcon, TrashIcon, UploadIcon } from '@heroicons/react/outline';
import React, { useContext, useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useParams } from 'react-router-dom';
import readXlsxFile from 'read-excel-file';
import { FILE_TYPES_ACCEPT } from '../../../../common/constants/file.constants';
import { triggerDownload } from '../../../../common/helpers/utils.helper';
import { useErrorToast } from '../../../../common/hooks/useToast';
import CardPanel from '../../../../components/card-panel/CardPanel';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import { AuthContext } from '../../../../contexts/AuthContext';
import {
  getInvestorsTemplate,
  getPartnersTemplate,
  getPublicFileUrl,
} from '../../../../services/files/File.service';
import {
  useDeleteInvestorByProfileMutation,
  useDeleteInvestorMutation,
  useDeletePartnerByProfileMutation,
  useDeletePartnerMutation,
  useUploadInvestorsByProfileList,
  useUploadInvestorsList,
  useUploadPartnersList,
  useUploadPartnersListByProfile,
} from '../../../../services/organization/Organization.queries';
import { useSelectedOrganization } from '../../../../store/selectors';
import { UserRole } from '../../../users/enums/UserRole.enum';
import { REQUEST_LOCATION } from '../../constants/location.constants';
import { Investor } from '../../interfaces/Investor.interface';
import { OrganizationContext } from '../../interfaces/OrganizationContext';
import { Partner } from '../../interfaces/Partner.interface';
import { Report } from '../../interfaces/Report.interface';
import ReportSummaryModal from './components/ReportSummaryModal';
import { InvestorsTableHeaders } from './table-headers/InvestorTable.headers';
import { PartnerTableHeaders } from './table-headers/PartnerTable.headers';
import { ReportsTableHeaders } from './table-headers/ReportsTable.headers';

const OrganizationData = () => {
  const { id } = useParams();

  const [isActivitySummaryModalOpen, setIsActivitySummaryModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const { role } = useContext(AuthContext);
  const { t } = useTranslation(['open_data', 'organization', 'common']);

  const { organizationReport, organization } = useSelectedOrganization();

  const { isLoading: updateReportPending, updateOrganization: updateReport } =
    useOutletContext<OrganizationContext>();

  // super-admin
  const {
    mutate: uploadPartners,
    error: uploadPartnersError,
    isLoading: uploadPartnersPending,
  } = useUploadPartnersList();

  const {
    mutate: uploadInvestors,
    error: uploadInvestorsError,
    isLoading: uploadInvestorsPending,
  } = useUploadInvestorsList();

  const {
    mutate: deleteInvestor,
    error: deleteInvestorError,
    isLoading: deleteInvestorPending,
  } = useDeleteInvestorMutation();

  const {
    mutate: deletePartner,
    error: deletePartnerError,
    isLoading: deletePartnerPending,
  } = useDeletePartnerMutation();

  // admin
  const {
    mutate: uploadPartnersByProfile,
    error: uploadPartnersByProfileError,
    isLoading: uploadPartnersByProfilePending,
  } = useUploadPartnersListByProfile();

  const {
    mutate: uploadInvestorsByProfile,
    error: uploadInvestorsByProfileError,
    isLoading: uploadInvestorsByProfilePending,
  } = useUploadInvestorsByProfileList();

  const {
    mutate: deleteInvestorByProfile,
    error: deleteInvestorByProfileError,
    isLoading: deleteInvestorByProfilePending,
  } = useDeleteInvestorByProfileMutation();

  const {
    mutate: deletePartnerByProfile,
    error: deletePartnerByProfileError,
    isLoading: deletePartnerByProfilePending,
  } = useDeletePartnerByProfileMutation();

  useEffect(() => {
    if (
      uploadPartnersError ||
      uploadInvestorsError ||
      deleteInvestorError ||
      deletePartnerError ||
      uploadPartnersByProfileError ||
      uploadInvestorsByProfileError ||
      deleteInvestorByProfileError ||
      deletePartnerByProfileError
    )
      useErrorToast(t('load_error'));
  }, [
    uploadPartnersError,
    uploadInvestorsError,
    deleteInvestorError,
    deletePartnerError,
    uploadPartnersByProfileError,
    uploadInvestorsByProfileError,
    deleteInvestorByProfileError,
    deletePartnerByProfileError,
  ]);

  const buildReportActionColumn = (): TableColumn<Report> => {
    const menuItems = [
      {
        name: t('edit', { ns: 'common' }),
        icon: PencilIcon,
        onClick: onEditReport,
      },
      {
        name: t('delete_data', { ns: 'common' }),
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
        name: t('download'),
        icon: DownloadIcon,
        onClick: onDownloadFile,
        type: PopoverMenuRowType.DOWNLOAD,
      },
    ];

    const adminMenuItems = [
      {
        name: t('download'),
        icon: DownloadIcon,
        onClick: onDownloadFile,
        type: PopoverMenuRowType.DOWNLOAD,
      },
      {
        name: t('upload'),
        icon: UploadIcon,
        onClick: setSelectedPartner,
        type: PopoverMenuRowType.UPLOAD,
        htmlFor: 'uploadPartners',
      },
      {
        name: t('delete'),
        icon: TrashIcon,
        onClick: onDeletePartner,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    const superAdminMenuItems = [
      {
        name: t('download'),
        icon: DownloadIcon,
        onClick: onDownloadFile,
        type: PopoverMenuRowType.DOWNLOAD,
      },
      {
        name: t('upload'),
        icon: UploadIcon,
        onClick: setSelectedPartner,
        type: PopoverMenuRowType.UPLOAD,
        htmlFor: 'uploadPartners',
      },
      {
        name: t('delete'),
        icon: TrashIcon,
        onClick: onDeletePartnerByOrganizationId,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: Partner) => (
        <PopoverMenu
          row={row}
          menuItems={
            id
              ? superAdminMenuItems
              : role === UserRole.EMPLOYEE
              ? employeeMenuItems
              : adminMenuItems
          }
        />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  const buildInvestorsActionColumn = (): TableColumn<Investor> => {
    const employeeMenuItems = [
      {
        name: t('download'),
        icon: DownloadIcon,
        onClick: onDownloadFile,
        type: PopoverMenuRowType.DOWNLOAD,
      },
    ];

    const adminMenuItems = [
      {
        name: t('download'),
        icon: DownloadIcon,
        onClick: onDownloadFile,
        type: PopoverMenuRowType.DOWNLOAD,
      },
      {
        name: t('upload'),
        icon: UploadIcon,
        onClick: setSelectedInvestor,
        type: PopoverMenuRowType.UPLOAD,
        htmlFor: 'uploadInvestors',
      },
      {
        name: t('delete'),
        icon: TrashIcon,
        onClick: onDeleteInvestor,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    const superAdminMenuItems = [
      {
        name: t('download'),
        icon: DownloadIcon,
        onClick: onDownloadFile,
        type: PopoverMenuRowType.DOWNLOAD,
      },
      {
        name: t('upload'),
        icon: UploadIcon,
        onClick: setSelectedInvestor,
        type: PopoverMenuRowType.UPLOAD,
        htmlFor: 'uploadInvestors',
      },
      {
        name: t('delete'),
        icon: TrashIcon,
        onClick: onDeleteInvestorByOrganizationId,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: Investor) => (
        <PopoverMenu
          row={row}
          menuItems={
            id
              ? superAdminMenuItems
              : role === UserRole.EMPLOYEE
              ? employeeMenuItems
              : adminMenuItems
          }
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

    updateReport(
      {
        id: organization?.id,
        organization: {
          report: {
            reportId: data.id,
            numberOfContractors: data.numberOfContractors ?? undefined,
            numberOfVolunteers: data.numberOfVolunteers ?? undefined,
            report: data.report || undefined,
          },
        },
      },
      {
        onError: () => {
          useErrorToast(t('load_error'));
        },
      },
    );
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
        useErrorToast(t('no_file'));
      }
    } catch (error) {
      useErrorToast(t('download_error'));
    }
  };

  const onDeletePartnerByOrganizationId = (row: Partner) => {
    if (id) deletePartner({ partnerId: row.id, id });
  };

  const onDeletePartner = (row: Partner) => {
    deletePartnerByProfile({ partnerId: row.id });
  };

  const onDeleteInvestorByOrganizationId = (row: Investor) => {
    if (id) deleteInvestor({ investorId: row.id, id });
  };

  const onDeleteInvestor = (row: Investor) => {
    deleteInvestorByProfile({ investorId: row.id });
  };

  const onUploadNewList = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      if (selectedPartner) uploadPartnersList(selectedPartner.id, event.target.files[0]);

      if (selectedInvestor) uploadInvestorsList(selectedInvestor.id, event.target.files[0]);
    }
    event.target.value = '';
  };

  const uploadPartnersList = async (partnerId: number, file: File) => {
    try {
      const rows = await readXlsxFile(file);
      if (rows.length <= 2) {
        useErrorToast(t('no_data'));
        return;
      }
      const data = new FormData();
      data.append('partners', file);
      data.append('numberOfPartners', (rows.length - 2).toString());
      if (id) {
        uploadPartners({ partnerId, data, id });
      } else {
        uploadPartnersByProfile({ partnerId, data });
      }
      setSelectedPartner(null);
    } catch (error) {
      useErrorToast(t('invalid'));
      return;
    }
  };

  const uploadInvestorsList = async (investorId: number, file: File) => {
    try {
      const rows = await readXlsxFile(file);
      if (rows.length <= 2) {
        useErrorToast(t('no_data'));
        return;
      }
      const data = new FormData();
      data.append('investors', file);
      data.append('numberOfInvestors', (rows.length - 2).toString());
      if (id) {
        uploadInvestors({ investorId, data, id });
      } else {
        uploadInvestorsByProfile({ investorId, data });
      }
      setSelectedInvestor(null);
    } catch (error) {
      useErrorToast(t('invalid'));
      return;
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      <CardPanel title={t('report.title')}>
        <>
          <div className="py-5">
            <p className="sm:text-sm lg:text-base text-xs font-normal text-gray-900 break-word">
              {t('report.data_update')}
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
            defaultSortFieldId={'year'}
            defaultSortAsc={false}
          />
        </>
      </CardPanel>
      <CardPanel title={t('partners.title')}>
        <>
          <input
            className="w-0 h-0"
            id="uploadPartners"
            name="uploadPartners"
            type="file"
            accept={FILE_TYPES_ACCEPT.EXCEL}
            onChange={onUploadNewList}
          />
          <div className="py-5">
            <p className="sm:text-sm lg:text-base text-xs font-normal text-gray-900 flex break-word">
              {t('partners.data_update')}
              <a
                aria-label={t('partners.download')}
                href={getPartnersTemplate()}
                className="text-green-500 flex align-middle justify-center ml-2 cursor-pointer break-keep"
                download
              >
                <DownloadIcon className="w-5 h-5" />
                {t('partners.download')}
              </a>
            </p>
          </div>
          <DataTableComponent
            columns={
              !location.pathname.includes(REQUEST_LOCATION)
                ? [...PartnerTableHeaders, buildPartnersActionColumn()]
                : PartnerTableHeaders
            }
            data={organizationReport?.partners || []}
            loading={
              uploadPartnersPending ||
              deletePartnerPending ||
              uploadPartnersByProfilePending ||
              deletePartnerByProfilePending
            }
            defaultSortFieldId={'year'}
            defaultSortAsc={false}
          />
        </>
      </CardPanel>
      <CardPanel title={t('investors.title')}>
        <>
          <input
            className="w-0 h-0"
            id="uploadInvestors"
            name="uploadInvestors"
            type="file"
            accept={FILE_TYPES_ACCEPT.EXCEL}
            onChange={onUploadNewList}
          />
          <div className="py-5">
            <p className="sm:text-sm lg:text-base text-xs font-normal text-gray-900 flex break-word">
              {t('investors.data_update')}
              <a
                aria-label={t('investors.download')}
                href={getInvestorsTemplate()}
                className="text-green-500 flex align-middle justify-center ml-2 cursor-pointer break-keep"
                download
              >
                <DownloadIcon className="w-5 h-5" />
                {t('investors.download')}
              </a>
            </p>
          </div>
          <DataTableComponent
            columns={
              !location.pathname.includes(REQUEST_LOCATION)
                ? [...InvestorsTableHeaders, buildInvestorsActionColumn()]
                : InvestorsTableHeaders
            }
            data={organizationReport?.investors || []}
            loading={
              uploadInvestorsPending ||
              deleteInvestorPending ||
              uploadInvestorsByProfilePending ||
              deleteInvestorByProfilePending
            }
            defaultSortFieldId={'year'}
            defaultSortAsc={false}
          />
        </>
      </CardPanel>
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
