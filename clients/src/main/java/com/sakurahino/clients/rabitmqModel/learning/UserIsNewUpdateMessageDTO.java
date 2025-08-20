package com.sakurahino.clients.rabitmqModel.learning;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserIsNewUpdateMessageDTO {
    String userId;
    Boolean isNew;
}
