package com.sakurahino.common.ex;


import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ExceptionCode {

    EMAIL_TON_TAI(1001, "Email đã tồn tại"),
    USERNAME_TON_TAI(1006,"Tài khoản đã tồn tại"),
    TAI_KHOAN_KHONG_TON_TAI(1002, "Tài khoản không tồn tại"),
    MAT_KHAU_KHONG_DUNG(1003, "Mật khẩu không đúng"),
    MAT_KHAU_COMFIRM_SAI(1006,"Mật khẩu xác nhận không đúng"),
    MA_XAC_NHAN_KHONG_HOP_LE(1004, "Mã xác nhận không hợp lệ"),
    MA_XAC_NHAN_HET_HAN(1005, "Mã xác nhận đã hết hạn"),
    MA_XAC_NHAN_DA_SU_DUNG(1006,"Mã xác nhận đã sử dụng"),

    //dung cho chung chung
    DU_LIEU_KHONG_TON_TAI(1007, "Không tìm thấy tài nguyên"),
    KHONG_CO_DU_LIEU_TRUYEN_VAO(1008, "Không có dữ liệu được truyền vào"),
    DU_LIEU_DA_TON_TAI(1009, "Dữ liệu đã tồn tại"),
    LOI_GOI_API_BEN_NGOAI(1010, "Lỗi khi gọi api bên ngoài"),
    DU_LIEU_TRUYEN_LEN_SAI(1011, "Dữ liệu không đúng"),
    LOI_SERVER(1012, "Lỗi logic"),


    // dùng ỏ learning service
    CHU_DE_KHONG_TON_TAI(2001, "Chủ đề không tồn tại"),
    LEVEL_KHONG_TON_TAI(2002,"Cấp độ không tôn tại"),
    LESSON_DA_TON_TAI(2003,"Tên bài học đã tồn tại"),
    MAX_PUBLIC_LESSON_REACHED(2004,"Số lượng bài học xuất bản đã tối ta"),
    LESSON_KHONG_TON_TAI(2005,"Bài học không tồn tại"),
    TOPIC_NAME_FOUND(2009,"Tên chủ đề đã tồn tại"),
    // dùng bên status
    USER_LESSON_STATUS_NOT_FOUND(2006,"trạng thái bài học của user không tồn tại"),
    USER_TOPIC_STATUS_NOT_FOUND(2007,"trạng thái chu de của user không tồn tại"),
    LESSON_STATUS_DONT_PUBLISHED(2008, "Bài học chưa được xuất bản"),

    //Upload-serivce
    FILE_NOT_NULL(3001,"Ảnh không được trống"),
    FILE_MAX(3002,"Ảnh vượt quá 5MB"),
    FILE_NOT_SUPPORT(3004,"File ảnh phải có định dạng jpg,png"),

    // kiểm tra quyền của user
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED.value(), "Bạn chưa đăng nhập"),
    PERMISSION_DENIED(HttpStatus.FORBIDDEN.value(), "Bạn không có quyền thực hiện hành động này"),
    USER_BLOCKED(HttpStatus.FORBIDDEN.value(), "Tài khoản của bạn đã bị khóa"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN.value(), "Truy cập bị từ chối");

    private final int status;
    private final String error;




    ExceptionCode(int status, String error) {
        this.status = status;
        this.error = error;
    }
}
