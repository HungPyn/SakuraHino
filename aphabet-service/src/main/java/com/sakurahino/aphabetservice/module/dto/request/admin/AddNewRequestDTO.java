package com.sakurahino.aphabetservice.module.dto.request.admin;

import com.sakurahino.aphabetservice.enums.AlphabetsStatus;
import com.sakurahino.aphabetservice.enums.CharacterType;
import lombok.Data;

@Data
public class AddNewRequestDTO {
    private CharacterType characterType;
    private String japaneseCharacter;
    private AlphabetsStatus status;
    private String meaning;
}
