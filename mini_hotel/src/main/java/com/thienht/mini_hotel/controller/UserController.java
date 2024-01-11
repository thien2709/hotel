package com.thienht.mini_hotel.controller;

import com.thienht.mini_hotel.dto.UserResponse;
import com.thienht.mini_hotel.model.Role;
import com.thienht.mini_hotel.model.User;
import com.thienht.mini_hotel.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final IUserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<User>> getUsers() {
        return new ResponseEntity<>(userService.getUsers(), HttpStatus.FOUND);
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getUser(@PathVariable("email") String email) {
        try {
            User theUser = userService.getUser(email);
            UserResponse user = new UserResponse(theUser.getId()
                    , theUser.getFirstName()
                    , theUser.getLastName()
                    , theUser.getEmail()
                    , theUser.getRoles().stream().map(Role::getName).toList()
            );
            return ResponseEntity.ok(user);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user");
        }
    }

    @DeleteMapping("/delete-user/{email}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or (hasRole('ROLE_USER')) and #email == principal.username")
    public ResponseEntity<String> deleteUser(@PathVariable("email") String email) {
        try {
            userService.deleteUser(email);
            return ResponseEntity.ok("User delete successfully");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user");
        }
    }
}
