package com.sakurahino.aphabetservice.module.dto.request.admin;

import com.sakurahino.aphabetservice.enums.CharacterType;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UpdateListCharacterRequestDTO {
    private CharacterType characterType;
    private List<UpdateCharactersDTO> charaterDTOS;
}
