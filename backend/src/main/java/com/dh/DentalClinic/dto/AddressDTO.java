package com.dh.DentalClinic.dto;

public record AddressDTO(
        Long id,
        String street,
        Integer number,
        String location,
        String province
) {}
