package com.sakurahino.aphabetservice.module.dto.request.admin;

import com.sakurahino.aphabetservice.enums.AlphabetsStatus;
import com.sakurahino.aphabetservice.enums.CharacterType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateCharaterDTO {
    private Long id;
    private CharacterType characterType;
    private String japaneseCharacter;
    private AlphabetsStatus alphabetsStatus;
    private String meaning;
    private String audioURL;
}
