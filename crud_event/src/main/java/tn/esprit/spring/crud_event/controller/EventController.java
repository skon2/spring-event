package tn.esprit.spring.crud_event.controller;

import tn.esprit.spring.crud_event.model.Event;
import tn.esprit.spring.crud_event.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EventController {
    private final EventService service;
    public EventController(EventService service) { this.service = service; }

    @GetMapping
    public List<Event> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public Event get(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Event event) {
        try {
            Event saved = service.create(event);
            return ResponseEntity.created(URI.create("/api/events/" + saved.getId())).body(saved);
        } catch (Exception e) {
            e.printStackTrace(); // print full error in backend logs
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public Event update(@PathVariable Long id, @Valid @RequestBody Event event) {
        return service.update(id, event);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
