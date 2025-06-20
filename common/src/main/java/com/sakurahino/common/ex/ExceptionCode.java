package com.sakurahino.common.ex;


import lombok.Getter;

@Getter
public enum ExceptionCode {

    EMAIL_TON_TAI(1001, "Email đã tồn tại"),
    USERNAME_TON_TAI(1006,"Tài khoản đã tồn tại"),
    TAI_KHOAN_KHONG_TON_TAI(1002, "Tài khoản không tồn tại"),
    MAT_KHAU_KHONG_DUNG(1003, "Mật khẩu không đúng"),
    MAT_KHAU_COMFIRM_SAI(1006,"Mật khẩu xác nhận không đúng"),
    MA_XAC_NHAN_KHONG_HOP_LE(1004, "Mã xác nhận không hợp lệ"),
    MA_XAC_NHAN_HET_HAN(1005, "Mã xác nhận đã hết hạn");

    private final int status;
    private final String error;

    ExceptionCode(int status, String error) {
        this.status = status;
        this.error = error;
    }
}
