package tn.esprit.spring.crud_event.service;

import tn.esprit.spring.crud_event.exception.ResourceNotFoundException;
import tn.esprit.spring.crud_event.model.Event;
import tn.esprit.spring.crud_event.repo.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class EventService {
    private final EventRepository repo;

    public EventService(EventRepository repo) {
        this.repo = repo;
    }

    public List<Event> findAll() {
        return repo.findAll();
    }

    public Event findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));
    }

    public Event create(Event event) {
        return repo.save(event);
    }

    public Event update(Long id, Event updated) {
        Event existing = findById(id);

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setDate(updated.getDate());
        existing.setLocation(updated.getLocation());
        existing.setPrice(updated.getPrice());
        existing.setOrganizerid(updated.getOrganizerid());
        existing.setImageUrl(updated.getImageUrl());
        existing.setNbplaces(updated.getNbplaces());
        existing.setNblikes(updated.getNblikes());

        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
