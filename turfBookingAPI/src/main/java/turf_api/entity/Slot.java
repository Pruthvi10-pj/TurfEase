package turf_api.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "slot")
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "turf_id", referencedColumnName = "turf_id")
    private Turf turf;


    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "slot_date")
    private LocalDate slotDate;

    @Column(name = "is_booked")
    private Boolean isBooked;

    // Getters and Setters
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Turf getTurf() {
        return turf;
    }
    
    public void setTurf(Turf turf) {
        this.turf = turf;
    }
    public LocalTime getStartTime() {
        return startTime;
    }
    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }
    public LocalTime getEndTime() {
        return endTime;
    }
    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
    public LocalDate getSlotDate() {
        return slotDate;
    }
    public void setSlotDate(LocalDate slotDate) {
        this.slotDate = slotDate;
    }
    public Boolean getIsBooked() {
        return isBooked;
    }
    public void setIsBooked(Boolean isBooked) {
        this.isBooked = isBooked;
    }
}
