import { FETCHED_BATCHES, FETCHED_ONE_BATCH, FETCHED_ONE_STUDENT } from '../actions/batches/fetch'
import { BATCH_CREATED } from '../actions/batches/create'
import { STUDENT_CREATED } from '../actions/students/create'
import { BATCH_UPDATED,
         STUDENTS_UPDATED,
         UPDATED_BATCH_PERFORMANCE,
         BATCH_REMOVED,
         STUDENT_UPDATED}
from '../actions/batches/update'

const INITIAL_STATE = {
  allBatches: [],
  selectedBatch: {
    number: 'Oops, I think we missed it.',
    students: [],
    startDate: new Date(),
    endDate: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  selectedStudent: {
    evaluations: [],
    name: '',
    photo: ''
  }
}

export default (state = INITIAL_STATE, { type, payload } = {}) => {
  switch (type) {
    case FETCHED_BATCHES:
      return Object.assign({}, state, { allBatches: payload})

    case FETCHED_ONE_BATCH:
      return { ...state, selectedBatch: payload }

    case BATCH_CREATED:
      return Object.assign({}, state, { allBatches: [payload].concat(state.allBatches) })

    case FETCHED_ONE_STUDENT:
      return Object.assign({}, state, { selectedStudent: payload })

    case STUDENT_CREATED:
    case STUDENTS_UPDATED:
    case BATCH_UPDATED:
      return Object.assign({}, state, { selectedBatch: payload })

    case STUDENT_UPDATED:
      return Object.assign({}, state, { selectedStudent: payload })

    case BATCH_REMOVED:
        return state.filter((batch) => (batch._id !== payload._id))

    case UPDATED_BATCH_PERFORMANCE:
      return { ...state, payload }

    default :
      return state
  }
}
