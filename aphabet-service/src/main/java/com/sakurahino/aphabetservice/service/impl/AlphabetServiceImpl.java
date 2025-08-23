package com.sakurahino.aphabetservice.service.impl;

import com.sakurahino.aphabetservice.enums.AlphabetsStatus;
import com.sakurahino.aphabetservice.enums.CharacterType;
import com.sakurahino.aphabetservice.module.dto.BaseResponeDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.AddListByTypeRequestDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.AddNewRequestDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.UpdateCharaterDTO;
import com.sakurahino.aphabetservice.module.dto.request.admin.UpdateListCharacterRequestDTO;
import com.sakurahino.aphabetservice.module.dto.response.admin.AddListByTypeResponseDTO;
import com.sakurahino.aphabetservice.module.dto.response.admin.UpdateListCharacterResponseDTO;
import com.sakurahino.aphabetservice.module.entity.Alphabet;
import com.sakurahino.aphabetservice.repository.AlphabetRepository;
import com.sakurahino.aphabetservice.service.AlphabetService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.sakurahino.common.util.TimeUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlphabetServiceImpl implements AlphabetService {
    private final AlphabetRepository alphabetRepository;


    @Override
    public List<Alphabet> getAllCharacter() {
        List<Alphabet> alphabets = alphabetRepository.findAll();

        if (alphabets.isEmpty()) {
            throw new IllegalArgumentException("No alphabet data found");
        }

        return alphabets;
    }

    @Override
    public ResponseEntity<BaseResponeDTO<List<Alphabet>>> getByCharacterType(CharacterType characterType) {
        List<Alphabet> alphabetList = alphabetRepository.findAllByCharacterType(characterType);
        if (alphabetList.isEmpty()) {
            throw new IllegalArgumentException("No alphabet data found");
        }
        return ResponseEntity.ok(BaseResponeDTO.<List<Alphabet>>builder()
                .statusCode("200")
                .errorMessage(null)
                .Data(alphabetList).build());
    }

    @Override
    public ResponseEntity<BaseResponeDTO<List<Alphabet>>> getByJapaneseCharacter(String japaneseCharacter) {
        List<Alphabet> alphabetList = alphabetRepository.findAllByJapaneseCharacter(japaneseCharacter);
        if (alphabetList.isEmpty()){
            throw new IllegalArgumentException("No alphabet data found");
        }
        return ResponseEntity.ok(BaseResponeDTO.<List<Alphabet>>builder().
                statusCode("200")
                .errorMessage(null)
                .Data(alphabetList)
                .build());
    }

    @Override
    public ResponseEntity<BaseResponeDTO<Alphabet>> addNewCharacter(AddNewRequestDTO addNewRequestDTO) {
        if (addNewRequestDTO == null){
            throw new IllegalArgumentException("No alphabet data found");
        }
        Instant createdAt = TimeUtils.nowInstant();
        Alphabet alphabet = Alphabet.builder()
                .code(UUID.randomUUID().toString())
                .japaneseCharacter(addNewRequestDTO.getJapaneseCharacter())
                .characterType(addNewRequestDTO.getCharacterType())
                .status(addNewRequestDTO.getStatus())
                .createdAt(createdAt)
                .build();
        alphabetRepository.save(alphabet);
        return ResponseEntity.ok(BaseResponeDTO.<Alphabet>builder().
                statusCode("200")
                .errorMessage(null)
                .Data(alphabet)
                .build());
    }

    @Override
    public ResponseEntity<BaseResponeDTO<AddListByTypeResponseDTO>> addListByType(AddListByTypeRequestDTO addListByTypeRequestDTO) {
        if (addListByTypeRequestDTO.getAddNewRequestDTOList().isEmpty()) {
            throw new IllegalArgumentException("Data not found in List");
        }

        Instant createdAt = TimeUtils.nowInstant();
        List<Alphabet> savedAlphabets = addListByTypeRequestDTO.getAddNewRequestDTOList().stream()
                .map(addNewRequestDTO -> {
                    Alphabet alphabet = Alphabet.builder()
                            .code(UUID.randomUUID().toString())
                            .japaneseCharacter(addNewRequestDTO.getJapaneseCharacter())
                            .characterType(addListByTypeRequestDTO.getCharacterType())
                            .status(addNewRequestDTO.getStatus())
                            .createdAt(createdAt)
                            .build();
                    return alphabetRepository.save(alphabet);
                })
                .toList();

        AddListByTypeResponseDTO responseDTO = AddListByTypeResponseDTO.builder()
                .characterType(addListByTypeRequestDTO.getCharacterType())
                .alphabetList(savedAlphabets)
                .build();

        return ResponseEntity.ok(
                BaseResponeDTO.<AddListByTypeResponseDTO>builder()
                        .statusCode("200")
                        .errorMessage(null)
                        .Data(responseDTO)
                        .build()
        );
    }

    @Override
    public ResponseEntity<BaseResponeDTO<Alphabet>> updateCharacter(UpdateCharaterDTO updateCharaterDTO) {
        Optional<Alphabet> alphabet = alphabetRepository.findById(updateCharaterDTO.getId());
        Instant modifyAt = TimeUtils.nowInstant();
        if (alphabet.isPresent()){
            Alphabet alphabetUpdate = alphabet.get();
            alphabetUpdate.setStatus(updateCharaterDTO.getAlphabetsStatus());
            alphabetUpdate.setModifyAt(modifyAt);
            alphabetUpdate.setJapaneseCharacter(updateCharaterDTO.getJapaneseCharacter());
            alphabetUpdate.setCharacterType(updateCharaterDTO.getCharacterType());
            alphabetRepository.save(alphabetUpdate);
            return ResponseEntity.ok(BaseResponeDTO.<Alphabet>builder()
                    .statusCode("200")
                    .errorMessage(null)
                    .Data(alphabetUpdate)
                    .build());
        }else {
            throw new IllegalArgumentException("Cannot find character by id");
        }
    }

    @Override
    @Transactional
    public ResponseEntity<BaseResponeDTO<UpdateListCharacterResponseDTO>> updateCharacterList(UpdateListCharacterRequestDTO updateListCharacterRequestDTO) {
        if (updateListCharacterRequestDTO.getCharaterDTOS().isEmpty()) {
            throw new IllegalArgumentException("List Request Null");
        }

        Instant modifyAt = TimeUtils.nowInstant();

        List<Alphabet> updatedAlphabets = updateListCharacterRequestDTO.getCharaterDTOS().stream()
                .map(dto -> {
                    Alphabet alphabet = alphabetRepository.findById(dto.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Alphabet not found with id: " + dto.getId()));

                    alphabet.setJapaneseCharacter(dto.getJapaneseCharacter());
                    alphabet.setCharacterType(updateListCharacterRequestDTO.getCharacterType());
                    alphabet.setStatus(dto.getAlphabetsStatus());
                    alphabet.setModifyAt(modifyAt);

                    return alphabetRepository.save(alphabet);
                })
                .toList();

        UpdateListCharacterResponseDTO responseData = UpdateListCharacterResponseDTO.builder()
                .characterType(updateListCharacterRequestDTO.getCharacterType())
                .charaterDTOS(updatedAlphabets)
                .build();

        return ResponseEntity.ok(
                BaseResponeDTO.<UpdateListCharacterResponseDTO>builder()
                        .statusCode("200")
                        .Data(responseData)
                        .build()
        );
    }

    @Override
    public ResponseEntity<BaseResponeDTO<Alphabet>> deleteCharater(Long id) {
        Optional<Alphabet> findAlphabet = alphabetRepository.findById(id);
        if (findAlphabet.isPresent()){
            Alphabet alphabet = findAlphabet.get();
            alphabet.setStatus(AlphabetsStatus.DELETED);
            return ResponseEntity.ok(BaseResponeDTO.<Alphabet>builder()
                    .statusCode("200")
                    .errorMessage("Success")
                    .Data(alphabet).build());
        }else {
            throw new IllegalArgumentException("Cannot find character");
        }
    }

    @Override
    public ResponseEntity<BaseResponeDTO<List<Alphabet>>> deleteListCharacter(List<Long> listId) {
       List<Alphabet> updatedList = listId.stream().map(
               alphabetRepository::findById)
               .filter(Optional::isPresent)
               .map(Optional::get)
               .peek(alphabet -> alphabet.setStatus(AlphabetsStatus.DELETED))
               .collect(Collectors.toList());
        if (updatedList.isEmpty()) {
            throw new IllegalArgumentException("No valid characters found to delete");
        }
        alphabetRepository.saveAll(updatedList);

        return ResponseEntity.ok(BaseResponeDTO.<List<Alphabet>>builder()
                .statusCode("200")
                .errorMessage("Success")
                .Data(updatedList)
                .build());
    }

}


