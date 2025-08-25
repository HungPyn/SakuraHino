package com.sakurahino.aphabetservice.module.dto.request.admin;

import com.sakurahino.aphabetservice.enums.AlphabetsStatus;
import lombok.Data;

@Data
public class AddListTypeDTO {
    private String japaneseCharacter;
    private AlphabetsStatus status;
    private String meaning;
}
