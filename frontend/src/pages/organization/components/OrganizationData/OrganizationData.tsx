import { DownloadIcon, PencilIcon, TrashIcon, UploadIcon } from '@heroicons/react/outline';
import React, { useContext, useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import readXlsxFile from 'read-excel-file';
import { FILE_TYPES_ACCEPT } from '../../../../common/constants/file.constants';
import { setUrlPrefix } from '../../../../common/helpers/format.helper';
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
  useDeletePartnerByProfileMutation,
  useUploadInvestorsByProfileList,
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
  // static links for partners and investors tables
  const [investorsLink, setInvestorsLink] = useState<string>('');
  const [partnersLink, setPartnersLink] = useState<string>('');

  const [isActivitySummaryModalOpen, setIsActivitySummaryModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const { role } = useContext(AuthContext);
  const { t } = useTranslation(['open_data', 'organization', 'common']);

  const { organizationReport, organization } = useSelectedOrganization();

  const { isLoading: updateReportPending, updateOrganization: updateReport } =
    useOutletContext<OrganizationContext>();

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
    if (uploadPartnersError || uploadInvestorsError || deleteInvestorError || deletePartnerError)
      useErrorToast(t('load_error'));
  }, [uploadPartnersError, uploadInvestorsError, deleteInvestorError, deletePartnerError]);

  const initTemplateData = async () => {
    setInvestorsLink(await getInvestorsTemplate());
    setPartnersLink(await getPartnersTemplate());
  };

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
      },
      {
        name: t('delete'),
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
        name: t('download'),
        icon: DownloadIcon,
        onClick: onDownloadFile,
        isDownload: true,
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
      },
      {
        name: t('delete'),
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

    updateReport(
      {
        id: organization?.id,
        organization: {
          report: {
            reportId: data.id,
            numberOfContractors: data.numberOfContractors ?? undefined,
            numberOfVolunteers: data.numberOfVolunteers ?? undefined,
            report: setUrlPrefix(data.report) || undefined,
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
    try {
      const rows = await readXlsxFile(file);
      if (rows.length <= 2) {
        useErrorToast(t('no_data'));
        return;
      }
      const data = new FormData();
      data.append('partners', file);
      data.append('numberOfPartners', (rows.length - 2).toString());
      uploadPartners({ partnerId, data });
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
      uploadInvestors({ investorId, data });
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
            <p className="sm:text-sm lg:text-base text-xs font-normal text-gray-900">
              {t('data_update', { ns: 'organization' })}
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
          <div className="py-5">
            <p className="sm:text-sm lg:text-base text-xs font-normal text-gray-900 flex">
              {t('data_update', { ns: 'organization' })}
              <a
                href={partnersLink}
                className="text-green-500 flex align-middle justify-center ml-2 cursor-pointer"
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
            loading={uploadPartnersPending || deletePartnerPending}
            defaultSortFieldId={'year'}
            defaultSortAsc={false}
          />
        </>
      </CardPanel>
      <CardPanel title={t('investors.title')}>
        <>
          <div className="py-5">
            <p className="sm:text-sm lg:text-base text-xs font-normal text-gray-900 flex">
              {t('data_update', { ns: 'organization' })}
              <a
                href={investorsLink}
                className="text-green-500 flex align-middle justify-center ml-2 cursor-pointer"
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
            loading={uploadInvestorsPending || deleteInvestorPending}
            defaultSortFieldId={'year'}
            defaultSortAsc={false}
          />
        </>
      </CardPanel>
      <input
        className="w-0 h-0"
        id="upload"
        name="upload"
        type="file"
        accept={FILE_TYPES_ACCEPT.EXCEL}
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
