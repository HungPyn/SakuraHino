package com.sakurahino.topicservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicRequest {

    @NotBlank(message = "Tên chủ đề không được trống")
    private String name;

    @NotBlank(message = "Cấp độ không được trống")
    private Integer levelId;
}
