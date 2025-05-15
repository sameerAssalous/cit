<?php

namespace Modules\Issue\Enums;

enum IssueStatus : int
{
    case OPEN = 1;
    case IN_PROGRESS = 2;
    case CLOSED = 4;
}
