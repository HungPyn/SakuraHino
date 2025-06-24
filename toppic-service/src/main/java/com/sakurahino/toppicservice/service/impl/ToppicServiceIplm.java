package com.sakurahino.toppicservice.service.impl;

import com.sakurahino.toppicservice.entity.Toppic;
import com.sakurahino.toppicservice.entity.dto.ToppicRequestDto;
import com.sakurahino.toppicservice.entity.dto.ToppicResponseDto;
import com.sakurahino.toppicservice.repositorys.ToppicRepository;
import com.sakurahino.toppicservice.service.GcsStorageService;
import com.sakurahino.toppicservice.service.ToppicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ToppicServiceIplm implements ToppicService {
    private final ToppicRepository toppicRepository;

    private final GcsStorageService gcsStorageService;

    @Override
    public List<ToppicResponseDto> getToppicsByIdLevel(Integer idLevel) {
        List<Toppic> toppics = toppicRepository.findTopicsByLevelId(idLevel);
        List<ToppicResponseDto> ListDto = toppics.stream().map(toppic ->
                ToppicResponseDto.builder()
                        .id(toppic.getId())
                        .topicName(toppic.getTopicName())
                        .avatarUrl(toppic.getAvatarUrl())
                        .dayCreation(toppic.getDayCreation())
                        .levelId(toppic.getLevelId())
                        .build()
                ).collect(Collectors.toList());

        return ListDto;
    }

    @Override
    public ToppicResponseDto getToppicById(Integer id) {
       Optional<Toppic> toppic = toppicRepository.findById(id);
        if(toppic.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy toppic");
        }
        ToppicResponseDto responseDto = ToppicResponseDto.builder()
                .id(toppic.get().getId())
                .topicName(toppic.get().getTopicName())
                .avatarUrl(toppic.get().getAvatarUrl())
                .dayCreation(toppic.get().getDayCreation())
                .levelId(toppic.get().getLevelId())
                .build();

        return responseDto;
    }

    @Override
    public ToppicResponseDto createToppic(ToppicRequestDto toppicRequestDto, MultipartFile avatarToppic) {
        Toppic toppic = new Toppic();

        toppic.setDayCreation(Instant.now());
        toppic.setTopicName(toppicRequestDto.getTopicName());
        //sau bổ sung tìm xem id level có tồn tại không thì mới tiếp tục thêm.
        toppic.setLevelId(toppicRequestDto.getLevelId());

        if(avatarToppic.isEmpty() || avatarToppic == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chưa thêm file ảnh");
        }

        String originalFilename = avatarToppic.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String objectName = UUID.randomUUID().toString() + fileExtension;

        try {
            gcsStorageService.uploadFileToPublicBucket(avatarToppic, objectName);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tải ảnh lên thất bại",e);
        }

        String publicUrl = gcsStorageService.getPublicFileUrl(objectName);
        toppic.setAvatarUrl(publicUrl);
        toppicRepository.save(toppic);
        return new ToppicResponseDto(toppic.getId(),toppic.getTopicName(),toppic.getAvatarUrl(),toppic.getDayCreation(),toppic.getLevelId());
    }

    @Override
    public ToppicResponseDto updateToppic(ToppicRequestDto toppicRequestDto, MultipartFile avatarToppic) {
        Optional<Toppic> toppicOptional = toppicRepository.findById(toppicRequestDto.getId());
        if(toppicOptional.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Toppic không tồn tại");
        }
        Toppic toppic = toppicOptional.get();
        toppic.setTopicName(toppicRequestDto.getTopicName());
        //Sau phải kiểm tra idLevel của LevelId DTO gửi lên có hợp lí và tồn tại không trước khi thêm vào
        toppic.setLevelId(toppicRequestDto.getLevelId());

        if(avatarToppic != null && !avatarToppic.isEmpty()){
            String oldAvataToppic = toppic.getAvatarUrl();

            String originalFilename = avatarToppic.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String objectName = UUID.randomUUID().toString() + fileExtension;

            try {
                // Upload file mới
                gcsStorageService.uploadFileToPublicBucket(avatarToppic, objectName);

                // Xóa file cũ (nếu có)
                if (oldAvataToppic != null && !oldAvataToppic.isEmpty()) {
                    gcsStorageService.deleteFile(oldAvataToppic);
                }
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Tải ảnh không thành công" + e);
            }
            String publicUrl = gcsStorageService.getPublicFileUrl(objectName);
            toppic.setAvatarUrl(publicUrl);
        }
        toppicRepository.save(toppic);

        return new ToppicResponseDto(toppic.getId(), toppic.getTopicName(),toppic.getAvatarUrl(),
                toppic.getDayCreation(),toppic.getLevelId());

    }

    @Override
    public void deteteToppic(Integer toppicId) {

        Optional<Toppic> toppic = toppicRepository.findById(toppicId);
        if(toppic.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy toppic");
        }
        toppicRepository.deleteById(toppicId);
    }
}
