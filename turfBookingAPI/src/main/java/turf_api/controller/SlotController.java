package turf_api.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import turf_api.entity.Slot;
import turf_api.service.SlotService;

@CrossOrigin
@RestController
@RequestMapping("/slots")
public class SlotController {

    private final SlotService slotService;

    public SlotController(SlotService slotService) {
        this.slotService = slotService;
    }

    // Correct: turfId is now part of the path
    @GetMapping("/turf/{turfId}")
    public List<Slot> getSlots(@PathVariable Integer turfId, @RequestParam String date) {
        return slotService.getSlotsByTurfAndDate(turfId, LocalDate.parse(date));
    }


    @PostMapping("/add/{turfId}")
    public List<Slot> addSlots(
            @PathVariable Integer turfId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody List<Slot> slots) {
        return slotService.addSlots(turfId, date, slots);
    }

    // Add a single slot for a turf
    @PostMapping("/add-single/{turfId}")
    public Slot addSlot(
            @PathVariable Integer turfId,
            @RequestBody Slot slot) {
        return slotService.addSlot(turfId, slot);
    }


    // PUT /turfs/{turfId}/slots/{slotId}
    @PutMapping("/{slotId}")
    public Slot updateSlot(@PathVariable Integer turfId, @PathVariable Integer slotId, @RequestBody Slot slot) {
        // turfId is not used here except for path consistency; you can validate ownership if needed
        return slotService.updateSlot(slotId, slot);
    }

    // DELETE /turfs/{turfId}/slots/{slotId}
    @DeleteMapping("/{slotId}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Integer turfId, @PathVariable Integer slotId) {
        slotService.deleteSlot(slotId);
        return ResponseEntity.noContent().build();
    }
}
