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
    MA_XAC_NHAN_HET_HAN(1005, "Mã xác nhận đã hết hạn"),
    DU_LIEU_KHONG_TON_TAI(1007, "Không tìm thấy tài nguyên"),
    KHONG_CO_DU_LIEU_TRUYEN_VAO(1008, "Không có dữ liệu được truyền vào"),
    DU_LIEU_DA_TON_TAI(1009, "Dữ liệu đã tồn tại"),
    LOI_GOI_API_BEN_NGOAI(1010, "Lỗi khi gọi api bên ngoài"),
    DU_LIEU_TRUYEN_LEN_SAI(1011, "Dữ liệu không đúng"),
    LOI_SERVER(1012, "Lỗi logic");

    private final int status;
    private final String error;

    ExceptionCode(int status, String error) {
        this.status = status;
        this.error = error;
    }
}
