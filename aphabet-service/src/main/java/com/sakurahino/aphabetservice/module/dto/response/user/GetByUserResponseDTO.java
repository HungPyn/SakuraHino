package com.sakurahino.aphabetservice.module.dto.response.user;

import com.sakurahino.aphabetservice.enums.AlphabetsStatus;
import com.sakurahino.aphabetservice.enums.CharacterType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetByUserResponseDTO {
    private String japaneseCharacter;
    private AlphabetsStatus alphabetsStatus;
    private CharacterType characterType;
    private String meaning;
    private String audioURL;
    private Long id;
}
