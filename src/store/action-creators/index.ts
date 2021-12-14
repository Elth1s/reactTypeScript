import * as AuthActionCreators from './auth';
import * as ProductActionCreators from '../../components/Products/actions'
export default {
    ...AuthActionCreators,
    ...ProductActionCreators
}