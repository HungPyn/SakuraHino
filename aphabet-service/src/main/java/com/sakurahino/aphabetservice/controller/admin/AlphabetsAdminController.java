package com.sakurahino.aphabetservice.controller.admin;

import com.sakurahino.aphabetservice.enums.CharacterType;
import com.sakurahino.aphabetservice.module.dto.BaseResponeDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.AddListByTypeRequestDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.AddNewRequestDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.UpdateCharaterDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.UpdateListCharacterRequestDTO;
import com.sakurahino.aphabetservice.module.dto.response.admin.AddListByTypeResponseDTO;
import com.sakurahino.aphabetservice.module.dto.response.admin.UpdateListCharacterResponseDTO;
import com.sakurahino.aphabetservice.module.entity.Alphabet;
import com.sakurahino.aphabetservice.service.AlphabetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alphabets/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AlphabetsAdminController {
    private final AlphabetService alphabetService;
    @GetMapping
    public ResponseEntity<BaseResponeDTO<List<Alphabet>>> getAllCharacter() {
        List<Alphabet> result = alphabetService.getAllCharacter();
        BaseResponeDTO<List<Alphabet>> response = BaseResponeDTO.<List<Alphabet>>builder()
                .statusCode("200")
                .errorMessage(null)
                .Data(result)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{character_type}")
    public ResponseEntity<BaseResponeDTO<List<Alphabet>>> getByCharacterType(
            @PathVariable("character_type") CharacterType characterType) {
        return alphabetService.getByCharacterType(characterType);
    }

    @GetMapping("/{japanese_character}")
    public ResponseEntity<BaseResponeDTO<List<Alphabet>>> getByJapaneseCharacter(@RequestParam String japaneseCharacter){
        return alphabetService.getByJapaneseCharacter(japaneseCharacter);
    }

    @PostMapping("/add")
    public ResponseEntity<BaseResponeDTO<Alphabet>> addNewCharacter (@RequestBody AddNewRequestDTO addNewRequestDTO){
        return alphabetService.addNewCharacter(addNewRequestDTO);
    }

    @PostMapping("/add/list")
    public ResponseEntity<BaseResponeDTO<AddListByTypeResponseDTO>> addListByType (@RequestBody AddListByTypeRequestDTO addListByTypeRequestDTO){
        return alphabetService.addListByType(addListByTypeRequestDTO);
    }

    @PostMapping("/update")
    public ResponseEntity<BaseResponeDTO<Alphabet>> updateCharacter(@RequestBody UpdateCharaterDTO updateCharaterDTO){
        return alphabetService.updateCharacter(updateCharaterDTO);
    }

    @PostMapping("/update/list")
    public ResponseEntity<BaseResponeDTO<UpdateListCharacterResponseDTO>> updateListByType(@RequestBody UpdateListCharacterRequestDTO updateListCharacterRequestDTO){
        return alphabetService.updateCharacterList(updateListCharacterRequestDTO);
    }

    @PostMapping("/delete")
    public ResponseEntity<BaseResponeDTO<Alphabet>> delete(@RequestBody Long id){
        return alphabetService.deleteCharater(id);
    }

    @PostMapping("/delete/list")
    public ResponseEntity<BaseResponeDTO<List<Alphabet>>> deleteList(@RequestBody List<Long> listId){
        return alphabetService.deleteListCharacter(listId);
    }

}
