import {observable,action,useStrict} from 'mobx'
useStrict(true)
export default class User {
    @observable token = ''
    @observable ctype = ''
    @observable userInfo = {}
    @observable read = 0
    @observable bink = {}
    @observable home = true
    @observable mark = ''
    @action setToken (data) {
        this.token = data
    }
    @action setUserInfo (data) {
        this.userInfo = data
    }
    @action setRead (data) {
        this.read = data
    }
    @action setBink (data) {
        this.bink = data
    }
    @action setHome (data) {
        this.home = data
    }
    @action setMark (data) {
        this.mark = data
    }
}