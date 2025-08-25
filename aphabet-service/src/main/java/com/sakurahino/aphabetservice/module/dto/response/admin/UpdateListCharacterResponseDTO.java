package com.sakurahino.aphabetservice.module.dto.response.admin;

import com.sakurahino.aphabetservice.enums.CharacterType;
import com.sakurahino.aphabetservice.module.entity.Alphabet;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UpdateListCharacterResponseDTO {
    private CharacterType characterType;
    private List<Alphabet> charaterDTOS;
}
