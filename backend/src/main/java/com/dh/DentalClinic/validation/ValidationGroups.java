package com.dh.DentalClinic.validation;

/**
 * Bean Validation groups for distinguishing create vs update payloads.
 *
 * Both groups extend javax Default so that constraints without an explicit
 * group (e.g. @NotNull) are also evaluated when either group is active.
 * Only @FutureOrPresent(groups = OnCreate.class) is skipped on PUT requests.
 *
 * Use @Validated(ValidationGroups.OnCreate.class) on POST endpoints
 * and @Validated(ValidationGroups.OnUpdate.class) on PUT endpoints.
 */
public interface ValidationGroups {
    /** Applied when creating a new resource. Also triggers Default-group constraints. */
    interface OnCreate extends jakarta.validation.groups.Default {}
    /** Applied when updating an existing resource. Also triggers Default-group constraints. */
    interface OnUpdate extends jakarta.validation.groups.Default {}
}
