export default {

    isFirstLogin: (state) => {
        let tempIsFirstLogin = localStorage.getItem('isFirstLogin')
        if (state.isFirstLogin) {
            if (tempIsFirstLogin === undefined || tempIsFirstLogin === null) {
                return state.isFirstLogin
            } else {
                return +tempIsFirstLogin
            }
        } else {
            return state.isFirstLogin
        }
    }
}