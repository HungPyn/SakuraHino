package com.sakurahino.aphabetservice.module.dto.request.admin;

import com.sakurahino.aphabetservice.enums.CharacterType;
import lombok.Data;

import java.util.List;

@Data
public class AddListByTypeRequestDTO {
    private CharacterType characterType;
    private List<AddListTypeDTO> addNewRequestDTOList;
}
