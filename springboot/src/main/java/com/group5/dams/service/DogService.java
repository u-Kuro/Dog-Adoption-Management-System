package com.group5.dams.service;

import com.group5.dams.model.Dog;
import com.group5.dams.model.Person;
import com.group5.dams.repository.DogRepository;
import com.group5.dams.repository.PendingAdoptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class DogService {
    @Autowired
    private DogRepository dogRepository;
    @Autowired
    private PendingAdoptionRepository pendingAdoptionRepository;

    public boolean isDogAvailable(long id) {
        return pendingAdoptionRepository.findByDogId(id).isEmpty();
    }

    public List<Dog> getAvailableDogs() {
        return dogRepository.findAllAvailableDogs().orElseGet(ArrayList::new);
    }

    public List<Dog> getDogs() {
        return (List<Dog>) dogRepository.findAll();
    }

    public Dog getDog(long id) {
        return dogRepository.findById(id).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dog is not found."));
    }

    public Dog addDog(Dog dog) {
        if(!(dog.getAge()>0)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, " Invalid age: " + dog.getAge());
        }
        if (dog.getName()==null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dog's name is required.");
        }
        if (dog.getBreed()==null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dog's breed is required.");
        }
        return dogRepository.save(dog);
    }

    public Dog updateDog(long id, Dog dog) {
        Dog foundDog = getDog(id);
        if(dog.getAge()>0) {
            foundDog.setAge(dog.getAge());
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, " Invalid age: " + dog.getAge());
        }
        if (dog.getName()!=null) {
            foundDog.setName(dog.getName());
        }
        if(dog.getBreed()!=null) {
            foundDog.setBreed(dog.getBreed());
        }
        return dogRepository.save(foundDog);
    }

    public void deleteDog(long id) {
        Dog dog = getDog(id);
        pendingAdoptionRepository.findByDogId(dog.getId()).ifPresent(pendingAdoption -> pendingAdoptionRepository.delete(pendingAdoption));
        dogRepository.delete(dog);
    }
}
