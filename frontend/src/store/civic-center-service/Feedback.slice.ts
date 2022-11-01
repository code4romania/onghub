import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IFeedback } from '../../pages/civic-center-service/interfaces/Feedback.interface';

export const feedbacksSlice = (set: any) => ({
  feedbacks: {
    items: [],
    meta: {
      currentPage: 1,
      itemCount: 0,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      orderByColumn: 'name',
      orderDirection: OrderDirection.ASC,
    },
  },
  setFeedbacks: (feedbacks: PaginatedEntity<IFeedback>) => {
    set({ feedbacks });
  },
});

export default { feedbacksSlice };
