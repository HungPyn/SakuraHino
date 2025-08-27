package com.sakurahino.JLPTservice.module.dto.request;

import com.sakurahino.JLPTservice.enums.StatusEnum;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
public class AddNewExamRequest {
    private String name;
    private MultipartFile file;
    private String examName;
    private String status;
    private String audioUrl;
    private Integer ExamTime;
}
