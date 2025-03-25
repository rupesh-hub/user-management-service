package com.alfarays.util;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Paging {

    private int page;
    private int size;
    private long totalElements;
    private long totalPages;
    private boolean first;
    private boolean last;

}