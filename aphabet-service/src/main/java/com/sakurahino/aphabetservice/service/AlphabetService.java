package com.sakurahino.aphabetservice.service;

import com.sakurahino.aphabetservice.enums.CharacterType;
import com.sakurahino.aphabetservice.module.dto.BaseResponeDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.AddListByTypeRequestDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.AddNewRequestDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.UpdateCharaterDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.UpdateListCharacterRequestDTO;
import com.sakurahino.aphabetservice.module.dto.response.admin.AddListByTypeResponseDTO;
import com.sakurahino.aphabetservice.module.dto.response.admin.UpdateListCharacterResponseDTO;
import com.sakurahino.aphabetservice.module.entity.Alphabet;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AlphabetService {
    List<Alphabet> getAllCharacter();

    ResponseEntity<BaseResponeDTO<List<Alphabet>>> getByCharacterType(CharacterType characterType);

    ResponseEntity<BaseResponeDTO<List<Alphabet>>> getByJapaneseCharacter(String japaneseCharacter);

    ResponseEntity<BaseResponeDTO<Alphabet>> addNewCharacter(AddNewRequestDTO addNewRequestDTO);

    ResponseEntity<BaseResponeDTO<AddListByTypeResponseDTO>> addListByType(AddListByTypeRequestDTO addListByTypeRequestDTO);

    ResponseEntity<BaseResponeDTO<Alphabet>> updateCharacter(UpdateCharaterDTO updateCharaterDTO);

    ResponseEntity<BaseResponeDTO<UpdateListCharacterResponseDTO>> updateCharacterList(UpdateListCharacterRequestDTO updateListCharacterRequestDTO);

    ResponseEntity<BaseResponeDTO<Alphabet>> deleteCharater(Long id);

    ResponseEntity<BaseResponeDTO<List<Alphabet>>> deleteListCharacter(List<Long> listId);
}
