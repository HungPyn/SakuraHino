package com.sakurahino.aphabetservice.repository;

import com.sakurahino.aphabetservice.enums.CharacterType;
import com.sakurahino.aphabetservice.module.entity.Alphabet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlphabetRepository extends JpaRepository<Alphabet, Long> {
    public List<Alphabet> findAllByCharacterType(CharacterType characterType);
    public List<Alphabet> findAllByJapaneseCharacter(String japaneseCharacter);

    @Query(value = """
    SELECT a.* 
    FROM alphabets a
    LEFT JOIN alphabets_user_status aus 
      ON a.id = aus.alphabet_id AND aus.user_id = :userId 
    WHERE a.status = 'PUBLISHED'
       AND (aus.id IS NULL OR aus.progress_status = 'NOT_LEARNED') 
    LIMIT 5
    """, nativeQuery = true)
    List<Alphabet> findRandomNewAlphabets(@Param("userId") String userId);

    @Query(value = """
    SELECT a.* 
    FROM alphabets a
    JOIN alphabets_user_status aus 
      ON a.id = aus.alphabet_id AND a.status = 'PUBLISHED'
    WHERE aus.user_id = :userId
      AND aus.progress_status = 'LEARNED'
      AND aus.next_due_date IS NOT NULL
      AND DATE(aus.next_due_date) = CURDATE()
    LIMIT 10
    """, nativeQuery = true)
    List<Alphabet> findAllDueToday(@Param("userId") String userId);



    @Query(value = """
    SELECT a.* 
    FROM alphabets a
    JOIN alphabets_user_status aus 
      ON a.id = aus.alphabet_id
    WHERE a.status = 'PUBLISHED'
      AND aus.user_id = :userId
      AND DATE(aus.next_dual_date) < CURRENT_DATE
    """, nativeQuery = true)
    List<Alphabet> findAllOutDate(@Param("userId") Long userId);
}
