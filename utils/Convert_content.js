const S = require('string');
const moment = require('moment')
const newMobi = {
    "Số TB": "933253453",
    "Loại TB": "Số MobiFone",
    "Trạng thái": "Số ngưng sử dụng",
    "Ngày thay đổi": "25-09-2017",
    "Mã cửa hàng": "2BTH00184",
    "Ngày tạo số": "25-05-2007",
    "Loại số": "Tu do",
    "Công ty": "8",
    "Số cấm tác động": "Không",
    "Loại cam kết": "CK150_40\t[Lịch sử]"
}
async function convert() {

    var infoString = 'Số TB: ' + newMobi['Số TB'].toString() + ' Công ty: ' + newMobi['Công ty'].toString() + ' Mã cửa hàng: ' + newMobi['Mã cửa hàng'].toString()
    var myDate = newMobi['Ngày thay đổi'].toString();
    myDate = myDate.split("-");
    var newDate = myDate[1] + "/" + myDate[0] + "/" + myDate[2];
    var checkChangeYear = new Date(new Date().getTime() - new Date(newDate).getTime()).getUTCFullYear() - 1970
    var checkChangeMonth = new Date(new Date().getTime() - new Date(newDate).getTime()).getMonth()
    var checkChangeDate = new Date(new Date().getTime() - new Date(newDate).getTime()).getUTCFullYear() - 1
    var finalCheck = checkChangeDate + checkChangeMonth * 30 + checkChangeYear * 365
    // if (newMobi['Trạng thái'].toString().search('Số đang sử dụng') == 0 || newMobi['Số cấm tác động'].toString().indexOf('Không') == 0) {
    //     infoString = '\nSố không còn'

    // } else if ((newMobi['Loại TB'].toString().indexOf('Số MobiCard') == 0 ||newMobi['Loại TB'].toString().indexOf('Số MobiCard') == 0  ||newMobi['Loại TB'].toString().indexOf('Số MobiCard') == 0) && newMobi['Loại số'].toString().indexOf('Tu do') == 0) {
    //     infoString += '\nSố còn '
    //     if (finalCheck > 5)  {
    //         infoString += 'chưa đấu được'
    //     }
    //     if (newMobi['Loại cam kết'].toString().indexOf('KHONG_CK') == 0) {
    //         infoString += 'trả sau thường'
    //     } else {
    //         infoString += newMobi['Loại cam kết'].toString().split('\t')[0];
    //     }
    // }

    if (newMobi['Trạng thái'].toString().search('Số đang sử dụng') == 0 || newMobi['Số cấm tác động'].toString().indexOf('Không') == -1) {
        infoString += '\nSố không còn'

    } else {
        if ((newMobi['Loại TB'].toString().indexOf('Số MobiCard') == 0 || newMobi['Loại TB'].toString().indexOf('Số MobiFone') == 0) && newMobi['Loại cam kết'].toString().indexOf('KHONG_CK') == 0) {
            
           const dau =  (finalCheck <= 5)? 'chưa đấu được': '';
           infoString += '\nSố còn, trả sau thường ' + dau
        } else if (newMobi['Mã cửa hàng'].toString().indexOf('2HCMCKCN') == 0) {
            const dau =  (finalCheck <= 5)? 'chưa đấu được': '';
            infoString += '\nSố còn, trả sau ' + newMobi['Loại cam kết'].toString().split('_')[0] + dau
        } else {
            infoString += '\nSố không còn'
        }
    }
    console.log(infoString);
    return infoString
}
module.exports = convert;