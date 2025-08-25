package com.sakurahino.aphabetservice.module.dto.request.admin;

import com.sakurahino.aphabetservice.enums.AlphabetsStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateCharactersDTO {
    private Long id;
    private String japaneseCharacter;
    private AlphabetsStatus alphabetsStatus;
    private String meaning;
}
