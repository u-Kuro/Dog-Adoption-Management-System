package com.group5.dams.service;

import com.group5.dams.model.Dog;
import com.group5.dams.repository.DogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DogService {
    @Autowired
    private DogRepository dogRepository;

    public List<Dog> getDogs() {
        return (List<Dog>) dogRepository.findAll();
    }

    public Dog getDog(long id) throws Exception {
        return dogRepository.findById(id).orElseThrow(() -> new Exception("Dog not found for id :: " + id));
    }

    public Dog addDog(Dog dog) {
        return dogRepository.save(dog);
    }

    public ResponseEntity<Dog> updateDog(long id, Dog dog) throws Exception {
        Dog foundDog = getDog(id);
        if(dog.getAge()>0) {
            foundDog.setAge(dog.getAge());
        } else {
            throw new Exception("Dog age is not valid");
        }
        if (dog.getName()!=null) {
            foundDog.setName(dog.getName());
        }
        if(dog.getBreed()!=null) {
            foundDog.setBreed(dog.getBreed());
        }
        final Dog updatedDog = dogRepository.save(foundDog);
        return ResponseEntity.ok(updatedDog);
    }

    public boolean deleteDog(long id) throws Exception {
        Dog dog = getDog(id);
        dogRepository.delete(dog);
        return true;
    }
}