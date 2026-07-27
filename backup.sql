--
-- PostgreSQL database dump
--

\restrict 6d4T4zL55TFKqhH2dDONPn3B5UBGd6SoSUj2eqRvOB2zIr82A04eEAxaZ4YsQaL

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: ActivityType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ActivityType" AS ENUM (
    'EVENT',
    'TRAVEL',
    'VEHICLE',
    'HOLIDAY',
    'ROOM',
    'TRAINING'
);


ALTER TYPE public."ActivityType" OWNER TO postgres;

--
-- Name: ChatChannelMemberRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ChatChannelMemberRole" AS ENUM (
    'MEMBER',
    'ADMIN',
    'OWNER'
);


ALTER TYPE public."ChatChannelMemberRole" OWNER TO postgres;

--
-- Name: ChatChannelType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ChatChannelType" AS ENUM (
    'GENERAL',
    'PRIVATE',
    'SYSTEM',
    'ADMIN_REQUESTS',
    'ADMIN_FEEDBACK',
    'DIRECT'
);


ALTER TYPE public."ChatChannelType" OWNER TO postgres;

--
-- Name: ChatMessageType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ChatMessageType" AS ENUM (
    'USER_MESSAGE',
    'SYSTEM_MESSAGE',
    'REQUEST_NOTIFICATION',
    'REQUEST_STATUS_UPDATE'
);


ALTER TYPE public."ChatMessageType" OWNER TO postgres;

--
-- Name: ConvocationAssignmentMode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ConvocationAssignmentMode" AS ENUM (
    'FIXED',
    'ASSIGNABLE',
    'OVERRIDDEN',
    'MIRRORED',
    'CUSTOM'
);


ALTER TYPE public."ConvocationAssignmentMode" OWNER TO postgres;

--
-- Name: ConvocationProgramStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ConvocationProgramStatus" AS ENUM (
    'DRAFT',
    'FINALIZED',
    'ARCHIVED'
);


ALTER TYPE public."ConvocationProgramStatus" OWNER TO postgres;

--
-- Name: HalfDaySlot; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."HalfDaySlot" AS ENUM (
    'MORNING',
    'AFTERNOON'
);


ALTER TYPE public."HalfDaySlot" OWNER TO postgres;

--
-- Name: LocationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LocationType" AS ENUM (
    'OFFICE',
    'OUTSIDE_OFFICE',
    'CUSTOM',
    'UNKNOWN'
);


ALTER TYPE public."LocationType" OWNER TO postgres;

--
-- Name: MapFurnitureType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MapFurnitureType" AS ENUM (
    'DESK',
    'COMPUTER_DESK',
    'CABINET',
    'TABLE',
    'CHAIR',
    'SERVER_RACK',
    'PRINTER_STATION',
    'RECEPTION',
    'WALL',
    'PARTITION',
    'OTHER',
    'MEETING_TABLE',
    'COUNTER',
    'PRINTER_TABLE',
    'NETWORK_RACK',
    'SHELF'
);


ALTER TYPE public."MapFurnitureType" OWNER TO postgres;

--
-- Name: MatchStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MatchStatus" AS ENUM (
    'MATCHED',
    'UNMATCHED',
    'CUSTOM',
    'MULTIPLE_MATCHES'
);


ALTER TYPE public."MatchStatus" OWNER TO postgres;

--
-- Name: NetworkConnectionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NetworkConnectionType" AS ENUM (
    'LAN',
    'WIFI',
    'FIBER',
    'USB',
    'BLUETOOTH',
    'OTHER',
    'VPN',
    'SHARED_PRINTER',
    'UNKNOWN'
);


ALTER TYPE public."NetworkConnectionType" OWNER TO postgres;

--
-- Name: NetworkDeviceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NetworkDeviceStatus" AS ENUM (
    'ONLINE',
    'OFFLINE',
    'WARNING',
    'UNKNOWN'
);


ALTER TYPE public."NetworkDeviceStatus" OWNER TO postgres;

--
-- Name: NetworkDeviceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NetworkDeviceType" AS ENUM (
    'DESKTOP',
    'LAPTOP',
    'PRINTER',
    'ACCESS_POINT',
    'SWITCH',
    'ROUTER',
    'FIREWALL',
    'SERVER',
    'IP_PHONE',
    'CCTV',
    'OTHER',
    'NAS',
    'NVR',
    'UPS'
);


ALTER TYPE public."NetworkDeviceType" OWNER TO postgres;

--
-- Name: ProjectCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProjectCategory" AS ENUM (
    'STATISTICAL_OPERATIONS',
    'CIVIL_REGISTRATION_VITAL_STATISTICS',
    'PHILIPPINE_IDENTIFICATION_SYSTEM',
    'ADMINISTRATIVE_ACCOUNTING_REPORTS'
);


ALTER TYPE public."ProjectCategory" OWNER TO postgres;

--
-- Name: ProjectFrequency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProjectFrequency" AS ENUM (
    'DAILY',
    'WEEKLY',
    'BI_WEEKLY',
    'MONTHLY',
    'QUARTERLY',
    'SEMI_ANNUAL',
    'ANNUAL',
    'AD_HOC',
    'CUSTOM'
);


ALTER TYPE public."ProjectFrequency" OWNER TO postgres;

--
-- Name: ProjectPriority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProjectPriority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE public."ProjectPriority" OWNER TO postgres;

--
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'COMPLETED',
    'OVERDUE',
    'DUE_TODAY',
    'DUE_SOON',
    'ON_TRACK',
    'NO_DEADLINE',
    'INACTIVE'
);


ALTER TYPE public."ProjectStatus" OWNER TO postgres;

--
-- Name: RoomReservationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RoomReservationStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."RoomReservationStatus" OWNER TO postgres;

--
-- Name: RoomReservationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RoomReservationType" AS ENUM (
    'HALF_DAY',
    'MULTIPLE_DAYS',
    'SINGLE_DAY'
);


ALTER TYPE public."RoomReservationType" OWNER TO postgres;

--
-- Name: TaskStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaskStatus" AS ENUM (
    'COMPLETED',
    'OVERDUE',
    'DUE_TODAY',
    'DUE_SOON',
    'ON_TRACK',
    'NO_DEADLINE',
    'INACTIVE'
);


ALTER TYPE public."TaskStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'SUPERVISOR',
    'EMPLOYEE',
    'VIEWER'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- Name: VehicleRequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VehicleRequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'ASSIGNED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."VehicleRequestStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "userId" text,
    action text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text NOT NULL,
    "oldValueJson" jsonb,
    "newValueJson" jsonb,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: CalendarActivity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CalendarActivity" (
    id text NOT NULL,
    type public."ActivityType" NOT NULL,
    title text NOT NULL,
    "soNumber" text,
    "soFileUrl" text,
    description text,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    location text,
    "personnelId" text,
    "vehicleName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "additionalTypes" public."ActivityType"[] DEFAULT ARRAY[]::public."ActivityType"[]
);


ALTER TABLE public."CalendarActivity" OWNER TO postgres;

--
-- Name: CanvasTemplate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CanvasTemplate" (
    id text NOT NULL,
    name text NOT NULL,
    layout jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CanvasTemplate" OWNER TO postgres;

--
-- Name: ChatAttachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatAttachment" (
    id text NOT NULL,
    "messageId" text NOT NULL,
    "fileName" text NOT NULL,
    "fileUrl" text NOT NULL,
    "mimeType" text NOT NULL,
    "fileSize" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChatAttachment" OWNER TO postgres;

--
-- Name: ChatChannel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatChannel" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "channelType" public."ChatChannelType" DEFAULT 'GENERAL'::public."ChatChannelType" NOT NULL,
    "createdById" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "photoUrl" text
);


ALTER TABLE public."ChatChannel" OWNER TO postgres;

--
-- Name: ChatChannelMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatChannelMember" (
    id text NOT NULL,
    "channelId" text NOT NULL,
    "userId" text NOT NULL,
    role public."ChatChannelMemberRole" DEFAULT 'MEMBER'::public."ChatChannelMemberRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChatChannelMember" OWNER TO postgres;

--
-- Name: ChatMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatMessage" (
    id text NOT NULL,
    "channelId" text NOT NULL,
    "senderUserId" text,
    "messageType" public."ChatMessageType" DEFAULT 'USER_MESSAGE'::public."ChatMessageType" NOT NULL,
    body text NOT NULL,
    "relatedEntityType" text,
    "relatedEntityId" text,
    "metadataJson" jsonb,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "replyToId" text
);


ALTER TABLE public."ChatMessage" OWNER TO postgres;

--
-- Name: ChatMessageRead; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatMessageRead" (
    id text NOT NULL,
    "messageId" text NOT NULL,
    "userId" text NOT NULL,
    "readAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChatMessageRead" OWNER TO postgres;

--
-- Name: ChatReaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ChatReaction" (
    id text NOT NULL,
    "messageId" text NOT NULL,
    "userId" text NOT NULL,
    emoji text,
    "customEmojiId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChatReaction" OWNER TO postgres;

--
-- Name: ConvocationAssignmentHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ConvocationAssignmentHistory" (
    id text NOT NULL,
    "programId" text NOT NULL,
    "groupId" text NOT NULL,
    "personnelId" text NOT NULL,
    "itemKey" text NOT NULL,
    "rotationKey" text NOT NULL,
    "convocationDate" timestamp(3) without time zone NOT NULL,
    "wasOverride" boolean DEFAULT false NOT NULL,
    "countedInRotation" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ConvocationAssignmentHistory" OWNER TO postgres;

--
-- Name: ConvocationGroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ConvocationGroup" (
    id text NOT NULL,
    name text NOT NULL,
    "sortOrder" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ConvocationGroup" OWNER TO postgres;

--
-- Name: ConvocationGroupMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ConvocationGroupMember" (
    id text NOT NULL,
    "groupId" text NOT NULL,
    "personnelId" text NOT NULL,
    "isTechnicalPerson" boolean DEFAULT false NOT NULL,
    "isGroupLead" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."ConvocationGroupMember" OWNER TO postgres;

--
-- Name: ConvocationProgram; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ConvocationProgram" (
    id text NOT NULL,
    "convocationDate" timestamp(3) without time zone NOT NULL,
    "groupId" text NOT NULL,
    status public."ConvocationProgramStatus" DEFAULT 'DRAFT'::public."ConvocationProgramStatus" NOT NULL,
    "generatedById" text,
    "finalizedById" text,
    "finalizedAt" timestamp(3) without time zone,
    "printedAt" timestamp(3) without time zone,
    notes text,
    "calendarActivityId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ConvocationProgram" OWNER TO postgres;

--
-- Name: ConvocationProgramItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ConvocationProgramItem" (
    id text NOT NULL,
    "programId" text NOT NULL,
    "itemKey" text NOT NULL,
    "itemLabel" text NOT NULL,
    "itemOrder" integer NOT NULL,
    "assignmentMode" public."ConvocationAssignmentMode" NOT NULL,
    "assignedPersonnelId" text,
    "suggestedPersonnelId" text,
    "fixedTextValue" text,
    "isEnabled" boolean DEFAULT true NOT NULL,
    "rotationKey" text,
    "mirrorOfItemKey" text,
    "countInRotation" boolean DEFAULT false NOT NULL,
    "overrideReason" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ConvocationProgramItem" OWNER TO postgres;

--
-- Name: ConvocationTemplateItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ConvocationTemplateItem" (
    id text NOT NULL,
    "itemKey" text NOT NULL,
    "itemLabel" text NOT NULL,
    "itemOrder" integer NOT NULL,
    "defaultMode" public."ConvocationAssignmentMode" NOT NULL,
    "fixedTextValue" text,
    "isEnabled" boolean DEFAULT true NOT NULL,
    "rotationKey" text,
    "mirrorOfItemKey" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ConvocationTemplateItem" OWNER TO postgres;

--
-- Name: CustomEmoji; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CustomEmoji" (
    id text NOT NULL,
    name text NOT NULL,
    "imageUrl" text NOT NULL,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CustomEmoji" OWNER TO postgres;

--
-- Name: EmployeeSeat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmployeeSeat" (
    id text NOT NULL,
    "mapId" text NOT NULL,
    "furnitureId" text,
    "personnelId" text,
    "seatCode" text NOT NULL,
    "xPercent" double precision DEFAULT 50 NOT NULL,
    "yPercent" double precision DEFAULT 50 NOT NULL,
    section text,
    room text,
    remarks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmployeeSeat" OWNER TO postgres;

--
-- Name: MapFurniture; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MapFurniture" (
    id text NOT NULL,
    "mapId" text NOT NULL,
    "furnitureCode" text NOT NULL,
    "furnitureName" text NOT NULL,
    type public."MapFurnitureType" DEFAULT 'DESK'::public."MapFurnitureType" NOT NULL,
    "xPercent" double precision DEFAULT 50 NOT NULL,
    "yPercent" double precision DEFAULT 50 NOT NULL,
    "widthPercent" double precision DEFAULT 5 NOT NULL,
    "heightPercent" double precision DEFAULT 3 NOT NULL,
    rotation double precision DEFAULT 0 NOT NULL,
    section text,
    room text,
    label text,
    remarks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MapFurniture" OWNER TO postgres;

--
-- Name: NetworkConnection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NetworkConnection" (
    id text NOT NULL,
    "mapId" text NOT NULL,
    "sourceDeviceId" text NOT NULL,
    "targetDeviceId" text NOT NULL,
    "connectionType" public."NetworkConnectionType" DEFAULT 'LAN'::public."NetworkConnectionType" NOT NULL,
    "sourcePort" text,
    "targetPort" text,
    "cableLabel" text,
    "isVerified" boolean DEFAULT false NOT NULL,
    remarks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."NetworkConnection" OWNER TO postgres;

--
-- Name: NetworkDevice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NetworkDevice" (
    id text NOT NULL,
    "mapId" text NOT NULL,
    "furnitureId" text,
    "employeeSeatId" text,
    "personnelId" text,
    "deviceCode" text NOT NULL,
    "deviceName" text NOT NULL,
    type public."NetworkDeviceType" DEFAULT 'DESKTOP'::public."NetworkDeviceType" NOT NULL,
    status public."NetworkDeviceStatus" DEFAULT 'UNKNOWN'::public."NetworkDeviceStatus" NOT NULL,
    hostname text,
    "ipAddress" text,
    "macAddress" text,
    section text,
    room text,
    "xPercent" double precision DEFAULT 50 NOT NULL,
    "yPercent" double precision DEFAULT 50 NOT NULL,
    "lastSeenAt" timestamp(3) without time zone,
    remarks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."NetworkDevice" OWNER TO postgres;

--
-- Name: NetworkMap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NetworkMap" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "imageUrl" text,
    "isActive" boolean DEFAULT false NOT NULL,
    "isLocked" boolean DEFAULT false NOT NULL,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."NetworkMap" OWNER TO postgres;

--
-- Name: PasswordResetToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PasswordResetToken" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tokenHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "usedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PasswordResetToken" OWNER TO postgres;

--
-- Name: PdfTemplate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PdfTemplate" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "fileName" text NOT NULL,
    "fileUrl" text NOT NULL,
    "pageCount" integer DEFAULT 1 NOT NULL,
    "fieldMap" jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "templateFeature" text DEFAULT 'GENERAL'::text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."PdfTemplate" OWNER TO postgres;

--
-- Name: Personnel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Personnel" (
    id text NOT NULL,
    slug text NOT NULL,
    "employeeNo" text,
    "fullName" text NOT NULL,
    "position" text NOT NULL,
    section text NOT NULL,
    email text,
    "contactNo" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "archiveReason" text,
    "archiveDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "locationStatus" text DEFAULT 'office'::text NOT NULL,
    "travelDestination" text,
    "travelDetails" text,
    "travelEndDate" timestamp(3) without time zone,
    "travelStartDate" timestamp(3) without time zone,
    "photoUrl" text
);


ALTER TABLE public."Personnel" OWNER TO postgres;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    code text,
    description text,
    category public."ProjectCategory" NOT NULL,
    subcategory text,
    section text,
    year integer NOT NULL,
    frequency public."ProjectFrequency" NOT NULL,
    "customFrequency" text,
    priority public."ProjectPriority" DEFAULT 'MEDIUM'::public."ProjectPriority" NOT NULL,
    "workloadWeight" double precision DEFAULT 1 NOT NULL,
    "estimatedMandays" double precision DEFAULT 0 NOT NULL,
    status public."ProjectStatus" DEFAULT 'ON_TRACK'::public."ProjectStatus" NOT NULL,
    "uiLayout" text DEFAULT 'BALANCED'::text NOT NULL,
    "showDescription" boolean DEFAULT true NOT NULL,
    "showOperationWorkload" boolean DEFAULT true NOT NULL,
    "showDeadlineSubmission" boolean DEFAULT true NOT NULL,
    "showDateSubmitted" boolean DEFAULT true NOT NULL,
    "showTotalSamplesDocuments" boolean DEFAULT true NOT NULL,
    "showResponseRate" boolean DEFAULT true NOT NULL,
    "operationWorkloadLabel" text DEFAULT 'Project/Operation/Workload'::text NOT NULL,
    "deadlineSubmissionLabel" text DEFAULT 'Deadline of Submission'::text NOT NULL,
    "dateSubmittedLabel" text DEFAULT 'Date Submitted'::text NOT NULL,
    "totalSamplesDocumentsLabel" text DEFAULT 'Total Sample/Documents'::text NOT NULL,
    "responseRateLabel" text DEFAULT 'Response Rate'::text NOT NULL,
    "customTaskColumns" jsonb,
    "canvasLayout" jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- Name: ProjectCycle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectCycle" (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "cycleName" text NOT NULL,
    month integer,
    quarter integer,
    year integer NOT NULL,
    "startDate" timestamp(3) without time zone,
    deadline timestamp(3) without time zone,
    "dateSubmitted" timestamp(3) without time zone,
    progress integer DEFAULT 0 NOT NULL,
    "responseRate" double precision,
    "totalSamplesDocuments" integer,
    status public."ProjectStatus" DEFAULT 'ON_TRACK'::public."ProjectStatus" NOT NULL,
    remarks text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProjectCycle" OWNER TO postgres;

--
-- Name: ProjectPermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectPermission" (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "userId" text NOT NULL,
    "canView" boolean DEFAULT true NOT NULL,
    "canEdit" boolean DEFAULT false NOT NULL,
    "canSubmit" boolean DEFAULT false NOT NULL,
    "canApprove" boolean DEFAULT false NOT NULL,
    "canManage" boolean DEFAULT false NOT NULL,
    "assignedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProjectPermission" OWNER TO postgres;

--
-- Name: ProjectPersonnel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectPersonnel" (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "personnelId" text NOT NULL,
    "roleInProject" text NOT NULL,
    "isFocalPerson" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProjectPersonnel" OWNER TO postgres;

--
-- Name: ProjectRemark; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectRemark" (
    id text NOT NULL,
    "projectId" text,
    "projectCycleId" text,
    "taskId" text,
    "authorId" text NOT NULL,
    "remarkText" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProjectRemark" OWNER TO postgres;

--
-- Name: ProjectTask; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProjectTask" (
    id text NOT NULL,
    "projectCycleId" text NOT NULL,
    "taskName" text NOT NULL,
    "assignedPersonnelId" text,
    "startDate" timestamp(3) without time zone,
    deadline timestamp(3) without time zone,
    "dateSubmitted" timestamp(3) without time zone,
    progress integer DEFAULT 0 NOT NULL,
    status public."TaskStatus" DEFAULT 'ON_TRACK'::public."TaskStatus" NOT NULL,
    "responseRate" double precision,
    "totalSamplesDocuments" integer,
    "customValues" jsonb,
    "manualStatusOverride" text,
    remarks text,
    "isSubtitle" boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProjectTask" OWNER TO postgres;

--
-- Name: Room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Room" (
    id text NOT NULL,
    name text NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "unavailableReason" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Room" OWNER TO postgres;

--
-- Name: RoomReservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RoomReservation" (
    id text NOT NULL,
    "roomId" text NOT NULL,
    "requesterPersonnelId" text NOT NULL,
    "requestedByUserId" text,
    "reservationType" public."RoomReservationType" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "halfDaySlot" public."HalfDaySlot",
    purpose text NOT NULL,
    remarks text,
    status public."RoomReservationStatus" DEFAULT 'PENDING'::public."RoomReservationStatus" NOT NULL,
    "approvedById" text,
    "approvedAt" timestamp(3) without time zone,
    "rejectedById" text,
    "rejectedAt" timestamp(3) without time zone,
    "rejectionReason" text,
    "cancelledAt" timestamp(3) without time zone,
    "calendarActivityId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RoomReservation" OWNER TO postgres;

--
-- Name: SpecialOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SpecialOrder" (
    id text NOT NULL,
    "referenceNo" text,
    "soNumber" text,
    "assignedDate" timestamp(3) without time zone,
    "activityDate" timestamp(3) without time zone,
    purpose text,
    destination text,
    remarks text,
    status text,
    "locationType" public."LocationType" DEFAULT 'UNKNOWN'::public."LocationType" NOT NULL,
    "calendarActivityId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "activityDateString" text
);


ALTER TABLE public."SpecialOrder" OWNER TO postgres;

--
-- Name: SpecialOrderPerson; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SpecialOrderPerson" (
    id text NOT NULL,
    "specialOrderId" text NOT NULL,
    "originalName" text NOT NULL,
    "normalizedName" text NOT NULL,
    "personnelId" text,
    "matchStatus" public."MatchStatus" DEFAULT 'UNMATCHED'::public."MatchStatus" NOT NULL,
    "customLabel" text,
    "isTravelTagged" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."SpecialOrderPerson" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    username text NOT NULL,
    email text,
    "mustChangePassword" boolean DEFAULT true NOT NULL,
    "passwordHash" text NOT NULL,
    role public."UserRole" DEFAULT 'VIEWER'::public."UserRole" NOT NULL,
    "personnelId" text,
    "employeeId" text,
    section text,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "photoUrl" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Vehicle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vehicle" (
    id text NOT NULL,
    name text NOT NULL,
    "plateNumber" text,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Vehicle" OWNER TO postgres;

--
-- Name: VehicleRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VehicleRequest" (
    id text NOT NULL,
    "requesterPersonnelId" text NOT NULL,
    "requestedByUserId" text,
    "travelDate" timestamp(3) without time zone NOT NULL,
    "departureAt" timestamp(3) without time zone,
    "expectedReturnAt" timestamp(3) without time zone,
    purpose text NOT NULL,
    destination text NOT NULL,
    status public."VehicleRequestStatus" DEFAULT 'PENDING'::public."VehicleRequestStatus" NOT NULL,
    "assignedVehicleId" text,
    "adminNotes" text,
    "rejectionReason" text,
    "reviewedById" text,
    "calendarActivityId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "soFileUrl" text,
    "soNumber" text
);


ALTER TABLE public."VehicleRequest" OWNER TO postgres;

--
-- Name: VehicleRequestPassenger; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VehicleRequestPassenger" (
    id text NOT NULL,
    "requestId" text NOT NULL,
    "personnelId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."VehicleRequestPassenger" OWNER TO postgres;

--
-- Name: _ActivityInvolvedPersonnel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ActivityInvolvedPersonnel" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ActivityInvolvedPersonnel" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, "userId", action, "entityType", "entityId", "oldValueJson", "newValueJson", "ipAddress", "userAgent", "createdAt") FROM stdin;
cmplkm62t0048iaegkf8fqzhb	cmplkm5x70000iaeg6ej70tgq	SEED	Database	phase-1	\N	\N	\N	\N	2026-05-25 18:59:44.837
cmpllew9g0001ia9gp1aqq1gf	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-25 19:22:05.141
cmpllf8b30003ia9gw2kzgkwp	cmplkm5x70000iaeg6ej70tgq	UPDATE_PASSWORD	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-25 19:22:20.752
cmpllrms50005ia9gj4cogapu	cmplkm5x70000iaeg6ej70tgq	UPDATE_USER	User	cmplkm5x70000iaeg6ej70tgq	{"id": "cmplkm5x70000iaeg6ej70tgq", "name": "Super Admin", "role": "SUPER_ADMIN", "email": "admin@ioms.local", "section": null, "isActive": true, "username": "superadmin", "createdAt": "2026-05-25T18:59:44.635Z", "updatedAt": "2026-05-25T19:22:20.747Z", "employeeId": null, "lastLoginAt": "2026-05-25T19:22:05.131Z", "personnelId": null, "passwordHash": "$2b$12$ncXrrKP3d8dH2b7V8.hzwOdGcL18X3B0aOELiFXCu09DWlDT3H6kC", "mustChangePassword": false}	{"id": "cmplkm5x70000iaeg6ej70tgq", "name": "Super Admin", "role": "SUPER_ADMIN", "email": "c.macabale.psa@gmail.com", "section": null, "isActive": true, "username": "superadmin", "createdAt": "2026-05-25T18:59:44.635Z", "updatedAt": "2026-05-25T19:31:59.375Z", "employeeId": null, "lastLoginAt": "2026-05-25T19:22:05.131Z", "personnelId": null, "passwordHash": "$2b$12$ncXrrKP3d8dH2b7V8.hzwOdGcL18X3B0aOELiFXCu09DWlDT3H6kC", "mustChangePassword": false}	\N	\N	2026-05-25 19:31:59.381
cmpm20a8a0001iaus7vmlumgc	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Project	cmplkm62d003uiaeg8oi5li6n	{"id": "cmplkm62d003uiaeg8oi5li6n", "code": "ACCT-RPT", "name": "Accounting Reports", "slug": "accounting-reports", "year": 2026, "status": "DUE_TODAY", "section": "Finance and Accounting", "category": "ADMINISTRATIVE_ACCOUNTING_REPORTS", "isActive": true, "priority": "MEDIUM", "uiLayout": "BALANCED", "createdAt": "2026-05-25T18:59:44.821Z", "frequency": "MONTHLY", "updatedAt": "2026-05-25T18:59:44.821Z", "createdById": "cmplkm5x70000iaeg6ej70tgq", "description": "Accounting Reports monitoring record for Phase 1 dashboard validation.", "subcategory": null, "updatedById": "cmplkm5x70000iaeg6ej70tgq", "canvasLayout": null, "workloadWeight": 2.8, "customFrequency": null, "showDescription": true, "estimatedMandays": 47, "showResponseRate": true, "customTaskColumns": null, "responseRateLabel": "Response Rate", "showDateSubmitted": true, "dateSubmittedLabel": "Date Submitted", "showOperationWorkload": true, "operationWorkloadLabel": "Project/Operation/Workload", "showDeadlineSubmission": true, "deadlineSubmissionLabel": "Deadline of Submission", "showTotalSamplesDocuments": true, "totalSamplesDocumentsLabel": "Total Sample/Documents"}	\N	\N	\N	2026-05-26 03:06:36.874
cmpm20e7z0003iaus18430qk7	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Project	cmplkm61z003giaegu28s5dtj	{"id": "cmplkm61z003giaegu28s5dtj", "code": "ADMIN-RPT", "name": "Administrative Reports", "slug": "administrative-reports", "year": 2026, "status": "COMPLETED", "section": "Administrative Unit", "category": "ADMINISTRATIVE_ACCOUNTING_REPORTS", "isActive": true, "priority": "MEDIUM", "uiLayout": "BALANCED", "createdAt": "2026-05-25T18:59:44.807Z", "frequency": "MONTHLY", "updatedAt": "2026-05-25T18:59:44.807Z", "createdById": "cmplkm5x70000iaeg6ej70tgq", "description": "Administrative Reports monitoring record for Phase 1 dashboard validation.", "subcategory": null, "updatedById": "cmplkm5x70000iaeg6ej70tgq", "canvasLayout": null, "workloadWeight": 2.6, "customFrequency": null, "showDescription": true, "estimatedMandays": 44, "showResponseRate": true, "customTaskColumns": null, "responseRateLabel": "Response Rate", "showDateSubmitted": true, "dateSubmittedLabel": "Date Submitted", "showOperationWorkload": true, "operationWorkloadLabel": "Project/Operation/Workload", "showDeadlineSubmission": true, "deadlineSubmissionLabel": "Deadline of Submission", "showTotalSamplesDocuments": true, "totalSamplesDocumentsLabel": "Total Sample/Documents"}	\N	\N	\N	2026-05-26 03:06:42.048
cmpm3skll0011iausc44tegah	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-26 03:56:36.297
cmpm4p7nd001siauspuri0v6f	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm4p7n6001qiausf4s5ahht	\N	{"id": "cmpm4p7n6001qiausf4s5ahht", "slug": "grad-lucky-mark-n-arcega", "email": "g.arcega.psa@gmail.com", "section": "Statistical Operations", "fullName": "Grad Lucky Mark N. Arcega", "isActive": true, "position": "SG 11 - Statistical Analyst", "contactNo": null, "createdAt": "2026-05-26T04:21:59.155Z", "updatedAt": "2026-05-26T04:21:59.155Z", "employeeNo": "PSA1043-011", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 04:21:59.161
cmpm4x3t0001wiaus72vg6btz	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmpm4x3su001uiausw8pb2snz	\N	{"id": "cmpm4x3su001uiausw8pb2snz", "name": "Grad Lucky Mark N. Arcega", "role": "ADMIN", "email": "g.arcega.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "username": "g.arcega", "createdAt": "2026-05-26T04:28:07.423Z", "updatedAt": "2026-05-26T04:28:07.423Z", "employeeId": "PSA1043-011", "lastLoginAt": null, "personnelId": "cmpm4p7n6001qiausf4s5ahht", "passwordHash": "$2b$12$tg68N747G80E8E1UbQvo8e5FmL5g9NjPMLDCxpSN1QrNcEaWNZ5zK", "mustChangePassword": true}	\N	\N	2026-05-26 04:28:07.429
cmpm66ckh001yiaus44bk65pb	cmpm4x3su001uiausw8pb2snz	LOGIN	User	cmpm4x3su001uiausw8pb2snz	\N	\N	\N	\N	2026-05-26 05:03:18.306
cmpm66xfe0020iausiogipv9t	cmpm4x3su001uiausw8pb2snz	LOGIN	User	cmpm4x3su001uiausw8pb2snz	\N	\N	\N	\N	2026-05-26 05:03:45.338
cmpm6bq8h0022iaus8pzxhuf7	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-26 05:07:29.297
cmpm6ek020024iaustb972e4c	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Personnel	cmplkm5xo0003iaegpcefgv2q	{"id": "cmplkm5xo0003iaegpcefgv2q", "slug": "ana-cruz", "email": "ana.cruz@ioms.local", "section": "Statistical Operations", "fullName": "Ana Cruz", "isActive": true, "position": "Senior Statistical Specialist", "contactNo": "0917-100-0003", "createdAt": "2026-05-25T18:59:44.653Z", "updatedAt": "2026-05-25T18:59:44.653Z", "employeeNo": "GOV-003", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	\N	2026-05-26 05:09:41.186
cmpm6eqsz0026iausrdm2j4g2	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Personnel	cmplkm5xv0006iaegbytyak7p	{"id": "cmplkm5xv0006iaegbytyak7p", "slug": "carlo-mendoza", "email": "carlo.mendoza@ioms.local", "section": "Philippine Identification System", "fullName": "Carlo Mendoza", "isActive": true, "position": "Information Systems Analyst", "contactNo": "0917-100-0006", "createdAt": "2026-05-25T18:59:44.659Z", "updatedAt": "2026-05-25T18:59:44.659Z", "employeeNo": "GOV-006", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	\N	2026-05-26 05:09:50.004
cmpm6euyy0028iaus8flisnik	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Personnel	cmplkm5y3000aiaeg618x7y3s	{"id": "cmplkm5y3000aiaeg618x7y3s", "slug": "ernesto-aquino", "email": "ernesto.aquino@ioms.local", "section": "Statistical Operations", "fullName": "Ernesto Aquino", "isActive": true, "position": "Statistical Specialist I", "contactNo": "0917-100-0010", "createdAt": "2026-05-25T18:59:44.668Z", "updatedAt": "2026-05-25T18:59:44.668Z", "employeeNo": "GOV-010", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	\N	2026-05-26 05:09:55.402
cmpm6eye0002aiauspwos8xme	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Personnel	cmplkm5xx0007iaegvsocaptd	{"id": "cmplkm5xx0007iaegvsocaptd", "slug": "grace-tan", "email": "grace.tan@ioms.local", "section": "Administrative and Accounting Reports", "fullName": "Grace Tan", "isActive": true, "position": "Administrative Officer IV", "contactNo": "0917-100-0007", "createdAt": "2026-05-25T18:59:44.661Z", "updatedAt": "2026-05-25T18:59:44.661Z", "employeeNo": "GOV-007", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	\N	2026-05-26 05:09:59.833
cmpm6f2bo002ciausquduw17k	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Personnel	cmplkm5xm0002iaegbxkb8g60	{"id": "cmplkm5xm0002iaegbxkb8g60", "slug": "jose-reyes", "email": "jose.reyes@ioms.local", "section": "Statistical Operations", "fullName": "Jose Reyes", "isActive": true, "position": "Supervising Statistical Specialist", "contactNo": "0917-100-0002", "createdAt": "2026-05-25T18:59:44.650Z", "updatedAt": "2026-05-25T18:59:44.650Z", "employeeNo": "GOV-002", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	\N	2026-05-26 05:10:04.932
cmpm6f5al002eiausvewnv48u	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Personnel	cmplkm5xt0005iaegbief4ynx	{"id": "cmplkm5xt0005iaegbief4ynx", "slug": "liza-navarro", "email": "liza.navarro@ioms.local", "section": "Statistical Operations", "fullName": "Liza Navarro", "isActive": true, "position": "Statistical Analyst", "contactNo": "0917-100-0005", "createdAt": "2026-05-25T18:59:44.657Z", "updatedAt": "2026-05-25T18:59:44.657Z", "employeeNo": "GOV-005", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	\N	2026-05-26 05:10:08.781
cmpm6f7vk002giaushfx5rfou	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Personnel	cmplkm5xi0001iaegziqnzio3	{"id": "cmplkm5xi0001iaegziqnzio3", "slug": "maria-santos", "email": "maria.santos@ioms.local", "section": "Statistical Operations", "fullName": "Maria Santos", "isActive": true, "position": "Chief Statistical Specialist", "contactNo": "0917-100-0001", "createdAt": "2026-05-25T18:59:44.646Z", "updatedAt": "2026-05-25T18:59:44.646Z", "employeeNo": "GOV-001", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	\N	2026-05-26 05:10:12.129
cmpm6fap2002iiausly05m6bg	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Personnel	cmplkm5xz0008iaego5m7ug1t	{"id": "cmplkm5xz0008iaego5m7ug1t", "slug": "michael-garcia", "email": "michael.garcia@ioms.local", "section": "Administrative and Accounting Reports", "fullName": "Michael Garcia", "isActive": true, "position": "Accountant III", "contactNo": "0917-100-0008", "createdAt": "2026-05-25T18:59:44.663Z", "updatedAt": "2026-05-25T18:59:44.663Z", "employeeNo": "GOV-008", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	\N	2026-05-26 05:10:15.783
cmpm6fe5m002kiaus2fxbwpa9	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Personnel	cmplkm5y10009iaeg3o0dsubj	{"id": "cmplkm5y10009iaeg3o0dsubj", "slug": "patricia-lim", "email": "patricia.lim@ioms.local", "section": "Statistical Operations", "fullName": "Patricia Lim", "isActive": true, "position": "Statistical Researcher", "contactNo": "0917-100-0009", "createdAt": "2026-05-25T18:59:44.666Z", "updatedAt": "2026-05-25T18:59:44.666Z", "employeeNo": "GOV-009", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	\N	2026-05-26 05:10:20.266
cmpm6fh20002miausoygklsy5	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Personnel	cmplkm5xr0004iaegdvfrs9nm	{"id": "cmplkm5xr0004iaegdvfrs9nm", "slug": "ramon-dela-pena", "email": "ramon.delapena@ioms.local", "section": "Statistical Operations", "fullName": "Ramon Dela Pena", "isActive": true, "position": "Statistical Specialist II", "contactNo": "0917-100-0004", "createdAt": "2026-05-25T18:59:44.655Z", "updatedAt": "2026-05-25T18:59:44.655Z", "employeeNo": "GOV-004", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	\N	2026-05-26 05:10:24.025
cmpm6iopm002piauswn3zl6sz	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm6ioph002niausbtnw8zo3	\N	{"id": "cmpm6ioph002niausbtnw8zo3", "slug": "maria-liza-m-bigornia", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "fullName": "Maria Liza M. Bigornia", "isActive": true, "position": "SG 24 - Chief Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:12:53.909Z", "updatedAt": "2026-05-26T05:12:53.909Z", "employeeNo": "PSA1043-", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:12:53.914
cmpm6izwr002riausimnfp3ap	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm6ioph002niausbtnw8zo3	{"id": "cmpm6ioph002niausbtnw8zo3", "slug": "maria-liza-m-bigornia", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "fullName": "Maria Liza M. Bigornia", "isActive": true, "position": "SG 24 - Chief Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:12:53.909Z", "updatedAt": "2026-05-26T05:12:53.909Z", "employeeNo": "PSA1043-", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm6ioph002niausbtnw8zo3", "slug": "maria-liza-m-bigornia", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "fullName": "Maria Liza M. Bigornia", "isActive": true, "position": "SG 24 - Chief Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:12:53.909Z", "updatedAt": "2026-05-26T05:13:08.421Z", "employeeNo": "PSA1043-001", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:13:08.427
cmpm6jzco002uiaus68o2copu	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm6jzck002siausjij512h3	\N	{"id": "cmpm6jzck002siausjij512h3", "slug": "jerwin-a-asi-ero", "email": "j.asinero@psa.gov.ph", "section": "Statistical Operations", "fullName": "Jerwin A. Asiñero", "isActive": true, "position": "SG 19 - Senior Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:13:54.356Z", "updatedAt": "2026-05-26T05:13:54.356Z", "employeeNo": "PSA1043-002", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:13:54.361
cmpm6z811002xiaus6149dtfl	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm6z80v002viausbcqx3ozw	\N	{"id": "cmpm6z80v002viausbcqx3ozw", "slug": "adams-christopher-p-sios-e", "email": "a.siose@psa.gov.ph", "section": "Statistical Operations", "fullName": "Adams Christopher P. Sios-e", "isActive": true, "position": "SG 16 - Statistical Specialist II", "contactNo": null, "createdAt": "2026-05-26T05:25:45.439Z", "updatedAt": "2026-05-26T05:25:45.439Z", "employeeNo": "PSA1043-003", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:25:45.445
cmpm70pwe0030iaus08ctfaxw	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm70pwb002yiaus2m2fx6w0	\N	{"id": "cmpm70pwb002yiaus2m2fx6w0", "slug": "lee-charge-s-cailing", "email": "l.cailing@psa.gov.ph", "section": "Statistical Operations", "fullName": "Lee Charge S. Cailing", "isActive": true, "position": "SG 16 - Statistical Specialist II", "contactNo": null, "createdAt": "2026-05-26T05:26:55.259Z", "updatedAt": "2026-05-26T05:26:55.259Z", "employeeNo": "PSA1043-004", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:26:55.263
cmpm71afv0033iausqy85nds6	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm71afq0031iausuxhheoyf	\N	{"id": "cmpm71afq0031iausuxhheoyf", "slug": "deana-dell-b-pornia", "email": "d.pornia@psa.gov.ph", "section": "Statistical Operations", "fullName": "Deana Dell B. Pornia", "isActive": true, "position": "SG 16 - Statistical Specialist II", "contactNo": null, "createdAt": "2026-05-26T05:27:21.878Z", "updatedAt": "2026-05-26T05:27:21.878Z", "employeeNo": "PSA1043-005", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:27:21.883
cmpm7nh3y0038iausdxvax2tj	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm7nh3s0036iausxm44cu9t	\N	{"id": "cmpm7nh3s0036iausxm44cu9t", "slug": "marivic-r-escobido", "email": "m.escobido@psa.gov.ph", "section": "Civil Registration and Vital Statistics", "fullName": "Marivic R. Escobido", "isActive": true, "position": "SG 14 - Registration Officer II", "contactNo": null, "createdAt": "2026-05-26T05:44:36.953Z", "updatedAt": "2026-05-26T05:44:36.953Z", "employeeNo": "PSA1043-006", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:44:36.959
cmpm7nzmq003biauszzolq8mu	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm7nzmm0039iauss19l621g	\N	{"id": "cmpm7nzmm0039iauss19l621g", "slug": "jemima-p-gutoc", "email": "j.gutoc@psa.gov.pph", "section": "Administrative and Accounting", "fullName": "Jemima P. Gutoc", "isActive": true, "position": "SG 12 - Accountant I", "contactNo": null, "createdAt": "2026-05-26T05:45:00.958Z", "updatedAt": "2026-05-26T05:45:00.958Z", "employeeNo": "PSA1043-007", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:45:00.962
cmpm7p9r9003eiausrze2gcpo	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm7p9r4003ciausxxtm77m0	\N	{"id": "cmpm7p9r4003ciausxxtm77m0", "slug": "jose-edgar-d-estrella", "email": "j.estrella@psa.gov.ph", "section": "Administrative and Accounting", "fullName": "Jose Edgar D. Estrella", "isActive": true, "position": "SG 11 - Administrative Officer II", "contactNo": null, "createdAt": "2026-05-26T05:46:00.736Z", "updatedAt": "2026-05-26T05:46:00.736Z", "employeeNo": "PSA1043-009", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:46:00.741
cmpm7q17m003hiausu51bozzv	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm7q17h003fiausimucssfj	\N	{"id": "cmpm7q17h003fiausimucssfj", "slug": "milan-l-gutay", "email": "m.gutay@psa.gov.ph", "section": "Statistical Operations", "fullName": "Milan L. Gutay", "isActive": true, "position": "SG 16 - Statistical Specialist II", "contactNo": null, "createdAt": "2026-05-26T05:46:36.318Z", "updatedAt": "2026-05-26T05:46:36.318Z", "employeeNo": "PSA1043-010", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:46:36.322
cmpm7rduh003kiausyk32rbd6	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm7rduc003iiausmprulwf1	\N	{"id": "cmpm7rduc003iiausmprulwf1", "slug": "aaron-allen-e-cainglet", "email": "a.cainglet@psa.gov.ph", "section": "Statistical Operations", "fullName": "Aaron Allen E. Cainglet", "isActive": true, "position": "SG 11 - Statistical Analyst", "contactNo": null, "createdAt": "2026-05-26T05:47:39.348Z", "updatedAt": "2026-05-26T05:47:39.348Z", "employeeNo": "PSA1043-012", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:47:39.353
cmpm7s7jd003niausknychluf	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm7s7j8003liauswjjxk8ex	\N	{"id": "cmpm7s7j8003liauswjjxk8ex", "slug": "marlon-t-galindo", "email": "m.galindo@psa.gov.ph", "section": "Statistical Operations", "fullName": "Marlon T. Galindo", "isActive": true, "position": "SG 9 - Assistant Statistician", "contactNo": null, "createdAt": "2026-05-26T05:48:17.829Z", "updatedAt": "2026-05-26T05:48:17.829Z", "employeeNo": "PSA1043-013", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:48:17.833
cmpm7sv6e003qiauskdchma2v	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm7sv69003oiausjksd398m	\N	{"id": "cmpm7sv69003oiausjksd398m", "slug": "merlie-t-montera", "email": "m.montera@psa.gov.ph", "section": "Statistical Operations", "fullName": "Merlie T. Montera", "isActive": true, "position": "SG 9 - Assistant Statistician", "contactNo": null, "createdAt": "2026-05-26T05:48:48.466Z", "updatedAt": "2026-05-26T05:48:48.466Z", "employeeNo": "PSA1043-014", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:48:48.47
cmpm7wjyy003tiausk86yjy6r	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm7wjyu003riaus32ihl37b	\N	{"id": "cmpm7wjyu003riaus32ihl37b", "slug": "cindy-b-dumaloan", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cindy B. Dumaloan", "isActive": true, "position": "SG 10 - Registration Officer I", "contactNo": null, "createdAt": "2026-05-26T05:51:40.567Z", "updatedAt": "2026-05-26T05:51:40.567Z", "employeeNo": "PSA1043-015", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:51:40.571
cmpm7y2db003wiausmgjgftsi	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm7y2d5003uiaushuvnjj0w	\N	{"id": "cmpm7y2d5003uiaushuvnjj0w", "slug": "may-t-dublin", "email": "m.dublin@psa.gov.ph", "section": "Civil Registration and Vital Statistics", "fullName": "May T. Dublin", "isActive": true, "position": "SG 10 - Registration Officer I", "contactNo": null, "createdAt": "2026-05-26T05:52:51.066Z", "updatedAt": "2026-05-26T05:52:51.066Z", "employeeNo": "PSA1043-016", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:52:51.071
cmpm7z8kg003ziausailo05dn	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm7z8kc003xiauswx84u6ek	\N	{"id": "cmpm7z8kc003xiauswx84u6ek", "slug": "maria-guada-f-dosdos", "email": "m.flores@psa.gov.ph", "section": "Administrative and Accounting", "fullName": "Maria Guada F. Dosdos", "isActive": true, "position": "SG 9 - Administrative Assistant III", "contactNo": null, "createdAt": "2026-05-26T05:53:45.756Z", "updatedAt": "2026-05-26T05:53:45.756Z", "employeeNo": "PSA1043-017", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 05:53:45.76
cmpm9wtb30042iaus8apnolko	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpm9wtav0040iaus5stdmg52	\N	{"id": "cmpm9wtav0040iaus5stdmg52", "slug": "vevien-p-baculio", "email": "v.baculio@psa.gov.ph", "section": "Administrative and Accounting", "fullName": "Vevien P. Baculio", "isActive": true, "position": "SG 6 - Administrative Aide VI", "contactNo": null, "createdAt": "2026-05-26T06:47:51.895Z", "updatedAt": "2026-05-26T06:47:51.895Z", "employeeNo": "PSA1043-018", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 06:47:51.904
cmpma9o4d0045iausly6rmuwl	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpma9o460043iausnsgkdz9b	\N	{"id": "cmpma9o460043iausnsgkdz9b", "slug": "glenda-c-bazar", "email": "g.bazar@psa.gov.ph", "section": "Administrative and Accounting", "fullName": "Glenda C. Bazar", "isActive": true, "position": "SG 6 - Administrative Aide VI", "contactNo": null, "createdAt": "2026-05-26T06:57:51.703Z", "updatedAt": "2026-05-26T06:57:51.703Z", "employeeNo": "PSA1043-019", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 06:57:51.709
cmpmaaekp0048iausq00uzulm	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmaaekm0046iausrahtxbtp	\N	{"id": "cmpmaaekm0046iausrahtxbtp", "slug": "brian-jay-sacala", "email": "b.sacala@psa.gov.ph", "section": "Statistical Operations", "fullName": "Brian Jay Sacala", "isActive": true, "position": "SG 16 - Information System Analyst II**", "contactNo": null, "createdAt": "2026-05-26T06:58:25.990Z", "updatedAt": "2026-05-26T06:58:25.990Z", "employeeNo": "PSA1043-020", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 06:58:25.993
cmpmaayym004biauspijj4mq7	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmaayyh0049iausqyybqoai	\N	{"id": "cmpmaayyh0049iausqyybqoai", "slug": "claudevan-a-macabale", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Claudevan A. Macabale", "isActive": true, "position": "SG 12 - Information System Analyst I**", "contactNo": "09696018203", "createdAt": "2026-05-26T06:58:52.409Z", "updatedAt": "2026-05-26T06:58:52.409Z", "employeeNo": "PSA1043-021", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 06:58:52.414
cmpmacki4004eiausl7lo8ukv	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmackhz004ciausks7jgn0o	\N	{"id": "cmpmackhz004ciausks7jgn0o", "slug": "kimberly-f-esmeralda", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Kimberly F. Esmeralda", "isActive": true, "position": "Field Office Personnel", "contactNo": null, "createdAt": "2026-05-26T07:00:06.983Z", "updatedAt": "2026-05-26T07:00:06.983Z", "employeeNo": "PSA1043-022", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:00:06.989
cmpmain4b004hiausc0eqqdis	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmain42004fiaus2twkusb1	\N	{"id": "cmpmain42004fiaus2twkusb1", "slug": "cherry-may-c-parajis", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cherry May C. Parajis", "isActive": true, "position": "Field Office Personnel", "contactNo": null, "createdAt": "2026-05-26T07:04:50.306Z", "updatedAt": "2026-05-26T07:04:50.306Z", "employeeNo": "PSA1043-023", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:04:50.315
cmpmajetr004kiausz2otkooi	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmajetn004iiaus2vel52gz	\N	{"id": "cmpmajetn004iiaus2vel52gz", "slug": "wed-micole-b-quilang", "email": "w.quilang.psa@gmail.com", "section": "Civil Registration and Vital Statistics", "fullName": "Wed Micole B. Quilang", "isActive": true, "position": "Birth Registration Assistant", "contactNo": null, "createdAt": "2026-05-26T07:05:26.219Z", "updatedAt": "2026-05-26T07:05:26.219Z", "employeeNo": "PSA1043-024", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:05:26.224
cmpmakc8m004niausvaaa55st	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmakc8i004liaus6oylw747	\N	{"id": "cmpmakc8i004liaus6oylw747", "slug": "kathleen-marie-p-medel", "email": "k.medel.psa@gmail.com", "section": "Statistical Operations", "fullName": "Kathleen Marie P. Medel", "isActive": true, "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T07:06:09.523Z", "updatedAt": "2026-05-26T07:06:09.523Z", "employeeNo": "PSA1043-025", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:06:09.526
cmpmaklxx004piausyv2dgow7	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmajetn004iiaus2vel52gz	{"id": "cmpmajetn004iiaus2vel52gz", "slug": "wed-micole-b-quilang", "email": "w.quilang.psa@gmail.com", "section": "Civil Registration and Vital Statistics", "fullName": "Wed Micole B. Quilang", "isActive": true, "position": "Birth Registration Assistant", "contactNo": null, "createdAt": "2026-05-26T07:05:26.219Z", "updatedAt": "2026-05-26T07:05:26.219Z", "employeeNo": "PSA1043-024", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmajetn004iiaus2vel52gz", "slug": "wed-micole-b-quilang", "email": "w.quilang.psa@gmail.com", "section": "Civil Registration and Vital Statistics", "fullName": "Wed Micole B. Quilang", "isActive": true, "position": "Birth Registration Assistant*", "contactNo": null, "createdAt": "2026-05-26T07:05:26.219Z", "updatedAt": "2026-05-26T07:06:22.095Z", "employeeNo": "PSA1043-024", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:06:22.102
cmpmalk2s004siausnp32p0dv	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmalk2l004qiausp3pm1z6f	\N	{"id": "cmpmalk2l004qiausp3pm1z6f", "slug": "joselindo-c-udal", "email": null, "section": "Philippine Identification System", "fullName": "Joselindo C. Udal", "isActive": true, "position": "Driver", "contactNo": null, "createdAt": "2026-05-26T07:07:06.334Z", "updatedAt": "2026-05-26T07:07:06.334Z", "employeeNo": "PSA1043-026", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:07:06.34
cmpmcv3up005miausweh6v3a2	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmcv3uk005kiausndde2tr6	\N	{"id": "cmpmcv3uk005kiausndde2tr6", "slug": "ronel-l-llamera", "email": "r.llamera.psa@gmail.com", "section": "Statistical Operations", "fullName": "Ronel L. Llamera", "isActive": true, "position": "SG 12 - Information System Analyst I*", "contactNo": null, "createdAt": "2026-05-26T08:10:31.101Z", "updatedAt": "2026-05-26T08:10:31.101Z", "employeeNo": "PSA1043-034", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 08:10:31.105
cmpmals9s004uiaustcexfdbi	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmalk2l004qiausp3pm1z6f	{"id": "cmpmalk2l004qiausp3pm1z6f", "slug": "joselindo-c-udal", "email": null, "section": "Philippine Identification System", "fullName": "Joselindo C. Udal", "isActive": true, "position": "Driver", "contactNo": null, "createdAt": "2026-05-26T07:07:06.334Z", "updatedAt": "2026-05-26T07:07:06.334Z", "employeeNo": "PSA1043-026", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmalk2l004qiausp3pm1z6f", "slug": "joselindo-c-udal", "email": null, "section": "Philippine Identification System", "fullName": "Joselindo C. Udal", "isActive": true, "position": "Driver*", "contactNo": null, "createdAt": "2026-05-26T07:07:06.334Z", "updatedAt": "2026-05-26T07:07:16.953Z", "employeeNo": "PSA1043-026", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:07:16.96
cmpmamcwu004xiausyaloa7o0	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmamcwq004viaus5y4atq5q	\N	{"id": "cmpmamcwq004viaus5y4atq5q", "slug": "hector-b-paylangco", "email": null, "section": "Administrative and Accounting", "fullName": "Hector B. Paylangco", "isActive": true, "position": "Driver*", "contactNo": null, "createdAt": "2026-05-26T07:07:43.706Z", "updatedAt": "2026-05-26T07:07:43.706Z", "employeeNo": "PSA1043-027", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:07:43.711
cmpmanukx0050iaussbu0cqmw	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmanuku004yiaush28acnzm	\N	{"id": "cmpmanuku004yiaush28acnzm", "slug": "christian-bryan-abaragan", "email": null, "section": "N/A", "fullName": "Christian Bryan Abaragan", "isActive": true, "position": "Utility*", "contactNo": null, "createdAt": "2026-05-26T07:08:53.262Z", "updatedAt": "2026-05-26T07:08:53.262Z", "employeeNo": "PSA1043-028", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:08:53.265
cmpmbbun90053iausko7kfq0z	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmbbun40051iaus0ypzmgo0	\N	{"id": "cmpmbbun40051iaus0ypzmgo0", "slug": "christian-jen-labado", "email": "c.labado.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Christian Jen Labado", "isActive": true, "position": "SG 14 - Registration Officer II*", "contactNo": null, "createdAt": "2026-05-26T07:27:33.088Z", "updatedAt": "2026-05-26T07:27:33.088Z", "employeeNo": "PSA1043-029", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:27:33.093
cmpmch4ls0055iausj0gqfp77	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmackhz004ciausks7jgn0o	{"id": "cmpmackhz004ciausks7jgn0o", "slug": "kimberly-f-esmeralda", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Kimberly F. Esmeralda", "isActive": true, "position": "Field Office Personnel", "contactNo": null, "createdAt": "2026-05-26T07:00:06.983Z", "updatedAt": "2026-05-26T07:00:06.983Z", "employeeNo": "PSA1043-022", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmackhz004ciausks7jgn0o", "slug": "kimberly-f-esmeralda", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Kimberly F. Esmeralda", "isActive": true, "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T07:00:06.983Z", "updatedAt": "2026-05-26T07:59:38.890Z", "employeeNo": "PSA1043-022", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:59:38.897
cmpmchaxg0057iausb7mpj1oo	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmain42004fiaus2twkusb1	{"id": "cmpmain42004fiaus2twkusb1", "slug": "cherry-may-c-parajis", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cherry May C. Parajis", "isActive": true, "position": "Field Office Personnel", "contactNo": null, "createdAt": "2026-05-26T07:04:50.306Z", "updatedAt": "2026-05-26T07:04:50.306Z", "employeeNo": "PSA1043-023", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmain42004fiaus2twkusb1", "slug": "cherry-may-c-parajis", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cherry May C. Parajis", "isActive": true, "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T07:04:50.306Z", "updatedAt": "2026-05-26T07:59:47.085Z", "employeeNo": "PSA1043-023", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 07:59:47.092
cmpmcmiuj005aiauseccqaztv	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmcmiud0058iaustuwfw2sp	\N	{"id": "cmpmcmiud0058iaustuwfw2sp", "slug": "angel-marie-guillena", "email": null, "section": "Administrative and Accounting", "fullName": "Angel Marie Guillena", "isActive": true, "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:03:50.629Z", "updatedAt": "2026-05-26T08:03:50.629Z", "employeeNo": "PSA1043-030", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 08:03:50.636
cmpmcsye5005diausukl5t1p7	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmcsydy005biaus8mz8wrn4	\N	{"id": "cmpmcsydy005biaus8mz8wrn4", "slug": "rodelyn-navarosa", "email": "r.navarosa.psa@gmail.com", "section": "Statistical Operations", "fullName": "Rodelyn Navarosa", "isActive": true, "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:08:50.710Z", "updatedAt": "2026-05-26T08:08:50.710Z", "employeeNo": "PSA1043-031", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 08:08:50.717
cmpmcttoe005giausm7olbkzs	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmctto9005eiaus7jv5w8sw	\N	{"id": "cmpmctto9005eiaus7jv5w8sw", "slug": "queenie-marie-b-casi-o", "email": "q.casino.psa@gmail.com", "section": "Statistical Operations", "fullName": "Queenie Marie B. Casiño", "isActive": true, "position": "SG 11 - Statistical Analyst*", "contactNo": null, "createdAt": "2026-05-26T08:09:31.258Z", "updatedAt": "2026-05-26T08:09:31.258Z", "employeeNo": "PSA1043-032", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 08:09:31.262
cmpmcug2c005jiaushrh3i407	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmcug27005hiauszp8pd7lt	\N	{"id": "cmpmcug27005hiauszp8pd7lt", "slug": "sheila-p-degala", "email": "s.degala.psa@gmail.com", "section": "Statistical Operations", "fullName": "Sheila P. Degala", "isActive": true, "position": "SG 9 - Assistant Statistician*", "contactNo": null, "createdAt": "2026-05-26T08:10:00.271Z", "updatedAt": "2026-05-26T08:10:00.271Z", "employeeNo": "PSA1043-033", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 08:10:00.276
cmpmcwkjp005piausl63oep6w	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmcwkjj005niausxhpwr0rq	\N	{"id": "cmpmcwkjj005niausxhpwr0rq", "slug": "paula-p-dedumo", "email": "p.dedumo.psa@gmail.com", "section": "Statistical Operations", "fullName": "Paula P. Dedumo", "isActive": true, "position": "SG 11 - Statistical Analyst*", "contactNo": null, "createdAt": "2026-05-26T08:11:39.392Z", "updatedAt": "2026-05-26T08:11:39.392Z", "employeeNo": "PSA1043-035", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 08:11:39.398
cmpmcxxgb005siauszu0xnj88	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmcxxg5005qiausn9g2slk7	\N	{"id": "cmpmcxxg5005qiausn9g2slk7", "slug": "edwin-d-me-oza", "email": "e.menoza.psa@gmail.com", "section": "Statistical Operations", "fullName": "Edwin D. Meñoza", "isActive": true, "position": "SG 16 - Statistical Specialist II*", "contactNo": null, "createdAt": "2026-05-26T08:12:42.774Z", "updatedAt": "2026-05-26T08:12:42.774Z", "employeeNo": "PSA1043-036", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 08:12:42.78
cmpmcyll4005viaus570dk1xz	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmcyll0005tiaus9udmpd06	\N	{"id": "cmpmcyll0005tiaus9udmpd06", "slug": "clarissa-l-nico", "email": "c.nico.psa@gmail.com", "section": "Statistical Operations", "fullName": "Clarissa L. Nico", "isActive": true, "position": "SG 9 - Assistant Statistician", "contactNo": null, "createdAt": "2026-05-26T08:13:14.053Z", "updatedAt": "2026-05-26T08:13:14.053Z", "employeeNo": "PSA1043-037", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 08:13:14.057
cmpmczbk3005yiauslw7zlmvu	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmczbk0005wiausmycr3jbp	\N	{"id": "cmpmczbk0005wiausmycr3jbp", "slug": "catherine-mae-g-chin", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Catherine Mae G. Chin", "isActive": true, "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T08:13:47.712Z", "updatedAt": "2026-05-26T08:13:47.712Z", "employeeNo": "PSA1043-038", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 08:13:47.715
cmpmd0y8m0061iausbfqv9d8u	cmplkm5x70000iaeg6ej70tgq	CREATE	Personnel	cmpmd0y8g005ziausnc38ns1g	\N	{"id": "cmpmd0y8g005ziausnc38ns1g", "slug": "sheila-may-d-regular", "email": "s.regular.psa@gmail.com", "section": "Statistical Operations", "fullName": "Sheila May D. Regular", "isActive": true, "position": "SG 11 - Statistical Analyst*", "contactNo": null, "createdAt": "2026-05-26T08:15:03.760Z", "updatedAt": "2026-05-26T08:15:03.760Z", "employeeNo": "PSA1043-039", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-26 08:15:03.766
cmpmv1lcu009wiausqalqxau6	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-26 16:39:26.814
cmpoxdvkn0001ia9wn7f9o36l	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-28 03:20:31.511
cmpoxpoaz0003ia9wsvgj1ubg	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-28 03:29:41.963
cmpoxvf6p0006ia9w8884qlra	cmplkm5x70000iaeg6ej70tgq	CREATE	Vehicle	cmpoxvf6h0004ia9wc2ulotr3	\N	{"id": "cmpoxvf6h0004ia9wc2ulotr3", "name": "Toyota HiAce", "isActive": true, "createdAt": "2026-05-28T03:34:10.073Z", "updatedAt": "2026-05-28T03:34:10.073Z", "description": "Van", "plateNumber": "SNA-9905"}	\N	\N	2026-05-28 03:34:10.081
cmpoxwo750009ia9wx721b4vt	cmplkm5x70000iaeg6ej70tgq	CREATE	Vehicle	cmpoxwo6x0007ia9w60idkoqx	\N	{"id": "cmpoxwo6x0007ia9w60idkoqx", "name": "Isuzu D-Max", "isActive": true, "createdAt": "2026-05-28T03:35:08.410Z", "updatedAt": "2026-05-28T03:35:08.410Z", "description": "Pickup Truck", "plateNumber": "SAB-6469"}	\N	\N	2026-05-28 03:35:08.418
cmpp2lkyr0001iafkvbr4hxph	cmplkm5x70000iaeg6ej70tgq	UPDATE	Room	room_conference	{"id": "room_conference", "name": "Conference Room", "isActive": true, "createdAt": "2026-05-28T13:30:52.976Z", "updatedAt": "2026-05-28T13:30:52.976Z", "isAvailable": false, "unavailableReason": "Being used by CBMS"}	{"id": "room_conference", "name": "Conference Room", "isActive": true, "createdAt": "2026-05-28T13:30:52.976Z", "updatedAt": "2026-05-28T05:46:29.083Z", "isAvailable": false, "unavailableReason": "Being used as CBMS Processing Room"}	\N	\N	2026-05-28 05:46:29.09
cmpp3ge1b0005iafklrwwzy9w	cmplkm5x70000iaeg6ej70tgq	UPDATE_USER	User	cmplkm5x70000iaeg6ej70tgq	{"id": "cmplkm5x70000iaeg6ej70tgq", "name": "Super Admin", "role": "SUPER_ADMIN", "email": "c.macabale.psa@gmail.com", "section": null, "isActive": true, "username": "superadmin", "createdAt": "2026-05-25T18:59:44.635Z", "updatedAt": "2026-05-28T03:29:41.951Z", "employeeId": null, "lastLoginAt": "2026-05-28T03:29:41.947Z", "personnelId": null, "passwordHash": "$2b$12$ncXrrKP3d8dH2b7V8.hzwOdGcL18X3B0aOELiFXCu09DWlDT3H6kC", "mustChangePassword": false}	{"id": "cmplkm5x70000iaeg6ej70tgq", "name": "Super Admin", "role": "SUPER_ADMIN", "email": "claudevanmacabale@gmail.com", "section": null, "isActive": true, "username": "superadmin", "createdAt": "2026-05-25T18:59:44.635Z", "updatedAt": "2026-05-28T06:10:26.440Z", "employeeId": null, "lastLoginAt": "2026-05-28T03:29:41.947Z", "personnelId": null, "passwordHash": "$2b$12$ncXrrKP3d8dH2b7V8.hzwOdGcL18X3B0aOELiFXCu09DWlDT3H6kC", "mustChangePassword": false}	\N	\N	2026-05-28 06:10:26.448
cmpp3gni30009iafk2clfdyb6	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmpp3gnhz0007iafkfwlwufi4	\N	{"id": "cmpp3gnhz0007iafkfwlwufi4", "name": "Claudevan A. Macabale", "role": "VIEWER", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "isActive": true, "username": "c.macabale", "createdAt": "2026-05-28T06:10:38.712Z", "updatedAt": "2026-05-28T06:10:38.712Z", "employeeId": "PSA1043-021", "lastLoginAt": null, "personnelId": "cmpmaayyh0049iausqyybqoai", "passwordHash": "$2b$12$V6RGdOezs6dnCfFE56vWXOyaMqWw7.nKjRNa5xDDW.BqoZdIF4g0e", "mustChangePassword": true}	\N	\N	2026-05-28 06:10:38.715
cmpp3hvrf000biafkp0e6t9iz	cmpp3gnhz0007iafkfwlwufi4	LOGIN	User	cmpp3gnhz0007iafkfwlwufi4	\N	\N	\N	\N	2026-05-28 06:11:36.075
cmpp3hytq000diafkn1t8i3yb	cmpp3gnhz0007iafkfwlwufi4	LOGIN	User	cmpp3gnhz0007iafkfwlwufi4	\N	\N	\N	\N	2026-05-28 06:11:40.046
cmpp3j2yi000fiafk4qjlf58e	cmpp3gnhz0007iafkfwlwufi4	UPDATE_PASSWORD	User	cmpp3gnhz0007iafkfwlwufi4	\N	\N	\N	\N	2026-05-28 06:12:32.059
cmpp642i5001piavsmpvqd19t	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp5y1c20001iavswnlk9g7q	{"id": "cmpp5y1c20001iavswnlk9g7q", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:09.026Z", "updatedAt": "2026-05-28T07:20:09.026Z", "isGroupLead": false, "personnelId": "cmpm6z80v002viausbcqx3ozw", "isTechnicalPerson": false}	{"id": "cmpp5y1c20001iavswnlk9g7q", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:09.026Z", "updatedAt": "2026-05-28T07:24:50.472Z", "isGroupLead": false, "personnelId": "cmpm6z80v002viausbcqx3ozw", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:24:50.477
cmpp3kg37000hiafkqeh3obn6	cmplkm5x70000iaeg6ej70tgq	UPDATE_USER	User	cmpp3gnhz0007iafkfwlwufi4	{"id": "cmpp3gnhz0007iafkfwlwufi4", "name": "Claudevan A. Macabale", "role": "VIEWER", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "isActive": true, "username": "c.macabale", "createdAt": "2026-05-28T06:10:38.712Z", "updatedAt": "2026-05-28T06:12:32.053Z", "employeeId": "PSA1043-021", "lastLoginAt": "2026-05-28T06:11:40.033Z", "personnelId": "cmpmaayyh0049iausqyybqoai", "passwordHash": "$2b$12$0mlQpr6JFQ3914xytXIiG.xvoXMDJigTQyafLxMju0nAO/xMpzTA2", "mustChangePassword": false}	{"id": "cmpp3gnhz0007iafkfwlwufi4", "name": "Claudevan A. Macabale", "role": "EMPLOYEE", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "isActive": true, "username": "c.macabale", "createdAt": "2026-05-28T06:10:38.712Z", "updatedAt": "2026-05-28T06:13:35.726Z", "employeeId": "PSA1043-021", "lastLoginAt": "2026-05-28T06:11:40.033Z", "personnelId": "cmpmaayyh0049iausqyybqoai", "passwordHash": "$2b$12$0mlQpr6JFQ3914xytXIiG.xvoXMDJigTQyafLxMju0nAO/xMpzTA2", "mustChangePassword": false}	\N	\N	2026-05-28 06:13:35.731
cmpp3m0cn000niafktqd92tt6	cmpp3gnhz0007iafkfwlwufi4	CREATE	VehicleRequest	cmpp3m0ca000jiafkq1g0p7y3	\N	{"id": "cmpp3m0ca000jiafkq1g0p7y3", "status": "PENDING", "purpose": "Supervision", "soNumber": null, "createdAt": "2026-05-28T06:14:48.635Z", "soFileUrl": null, "updatedAt": "2026-05-28T06:14:48.635Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": null, "destination": "Gingoog City", "reviewedById": null, "rejectionReason": null, "expectedReturnAt": null, "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-05-28 06:14:48.647
cmpp3oaet000piafk23jb7snp	cmplkm5x70000iaeg6ej70tgq	UPDATE	VehicleRequest	cmpp3m0ca000jiafkq1g0p7y3	{"id": "cmpp3m0ca000jiafkq1g0p7y3", "status": "PENDING", "purpose": "Supervision", "soNumber": null, "createdAt": "2026-05-28T06:14:48.635Z", "soFileUrl": null, "updatedAt": "2026-05-28T06:14:48.635Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": null, "destination": "Gingoog City", "reviewedById": null, "assignedVehicle": null, "rejectionReason": null, "expectedReturnAt": null, "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpp3m0ca000jiafkq1g0p7y3", "status": "PENDING", "purpose": "Supervision", "soNumber": null, "createdAt": "2026-05-28T06:14:48.635Z", "soFileUrl": null, "updatedAt": "2026-05-28T06:16:34.981Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": null, "destination": "Gingoog City", "reviewedById": "cmplkm5x70000iaeg6ej70tgq", "rejectionReason": null, "expectedReturnAt": null, "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-05-28 06:16:34.998
cmpp3otwt000riafkmjdb0zq3	cmplkm5x70000iaeg6ej70tgq	UPDATE	VehicleRequest	cmpp3m0ca000jiafkq1g0p7y3	{"id": "cmpp3m0ca000jiafkq1g0p7y3", "status": "PENDING", "purpose": "Supervision", "soNumber": null, "createdAt": "2026-05-28T06:14:48.635Z", "soFileUrl": null, "updatedAt": "2026-05-28T06:16:34.981Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": null, "destination": "Gingoog City", "reviewedById": "cmplkm5x70000iaeg6ej70tgq", "assignedVehicle": null, "rejectionReason": null, "expectedReturnAt": null, "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpp3m0ca000jiafkq1g0p7y3", "status": "PENDING", "purpose": "Supervision", "soNumber": null, "createdAt": "2026-05-28T06:14:48.635Z", "soFileUrl": null, "updatedAt": "2026-05-28T06:17:00.256Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": null, "destination": "Gingoog City", "reviewedById": "cmplkm5x70000iaeg6ej70tgq", "rejectionReason": null, "expectedReturnAt": null, "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-05-28 06:17:00.27
cmpp3p9ui000viafkehf432iy	cmplkm5x70000iaeg6ej70tgq	UPDATE	VehicleRequest	cmpp3m0ca000jiafkq1g0p7y3	{"id": "cmpp3m0ca000jiafkq1g0p7y3", "status": "PENDING", "purpose": "Supervision", "soNumber": null, "createdAt": "2026-05-28T06:14:48.635Z", "soFileUrl": null, "updatedAt": "2026-05-28T06:17:00.256Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": null, "destination": "Gingoog City", "reviewedById": "cmplkm5x70000iaeg6ej70tgq", "assignedVehicle": null, "rejectionReason": null, "expectedReturnAt": null, "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpp3m0ca000jiafkq1g0p7y3", "status": "APPROVED", "purpose": "Supervision", "soNumber": null, "createdAt": "2026-05-28T06:14:48.635Z", "soFileUrl": null, "updatedAt": "2026-05-28T06:17:20.894Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": null, "destination": "Gingoog City", "reviewedById": "cmplkm5x70000iaeg6ej70tgq", "rejectionReason": null, "expectedReturnAt": null, "assignedVehicleId": "cmpoxwo6x0007ia9w60idkoqx", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-05-28 06:17:20.923
cmpp40fls000ziafkz5ebkk1c	cmpp3gnhz0007iafkfwlwufi4	CREATE	RoomReservation	cmpp40flj000xiafk3c3b50ct	\N	{"id": "cmpp40flj000xiafk3c3b50ct", "roomId": "room_training", "status": "PENDING", "endDate": "2026-06-02T16:00:00.000Z", "purpose": "Training for PhilSys", "remarks": null, "createdAt": "2026-05-28T06:26:01.592Z", "startDate": "2026-05-31T16:00:00.000Z", "updatedAt": "2026-05-28T06:26:01.592Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": null, "rejectedById": null, "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-05-28 06:26:01.6
cmpp643z2001riavs3px7ovf8	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp5ygry0005iavszugd8qyc	{"id": "cmpp5ygry0005iavszugd8qyc", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:29.039Z", "updatedAt": "2026-05-28T07:20:29.039Z", "isGroupLead": false, "personnelId": "cmpm7s7j8003liauswjjxk8ex", "isTechnicalPerson": false}	{"id": "cmpp5ygry0005iavszugd8qyc", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:29.039Z", "updatedAt": "2026-05-28T07:24:52.378Z", "isGroupLead": false, "personnelId": "cmpm7s7j8003liauswjjxk8ex", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:24:52.383
cmpp645ms001tiavsllsr58dq	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp5ym4v0009iavs2l66v6n3	{"id": "cmpp5ym4v0009iavs2l66v6n3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:35.983Z", "updatedAt": "2026-05-28T07:20:35.983Z", "isGroupLead": false, "personnelId": "cmpm7wjyu003riaus32ihl37b", "isTechnicalPerson": false}	{"id": "cmpp5ym4v0009iavs2l66v6n3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:35.983Z", "updatedAt": "2026-05-28T07:24:54.528Z", "isGroupLead": false, "personnelId": "cmpm7wjyu003riaus32ihl37b", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:24:54.532
cmpp40wwi0011iafktfhu0dr0	cmplkm5x70000iaeg6ej70tgq	UPDATE	RoomReservation	cmpp40flj000xiafk3c3b50ct	{"id": "cmpp40flj000xiafk3c3b50ct", "room": {"id": "room_training", "name": "Training Room", "isActive": true, "createdAt": "2026-05-28T13:30:52.976Z", "updatedAt": "2026-05-28T13:30:52.976Z", "isAvailable": true, "unavailableReason": null}, "roomId": "room_training", "status": "PENDING", "endDate": "2026-06-02T16:00:00.000Z", "purpose": "Training for PhilSys", "remarks": null, "createdAt": "2026-05-28T06:26:01.592Z", "requester": {"id": "cmpmaayyh0049iausqyybqoai", "slug": "claudevan-a-macabale", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Claudevan A. Macabale", "isActive": true, "position": "SG 12 - Information System Analyst I**", "contactNo": "09696018203", "createdAt": "2026-05-26T06:58:52.409Z", "updatedAt": "2026-05-26T06:58:52.409Z", "employeeNo": "PSA1043-021", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}, "startDate": "2026-05-31T16:00:00.000Z", "updatedAt": "2026-05-28T06:26:01.592Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": null, "rejectedById": null, "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpp40flj000xiafk3c3b50ct", "roomId": "room_training", "status": "PENDING", "endDate": "2026-06-02T16:00:00.000Z", "purpose": "Training for PhilSys", "remarks": null, "createdAt": "2026-05-28T06:26:01.592Z", "startDate": "2026-05-31T16:00:00.000Z", "updatedAt": "2026-05-28T06:26:24.005Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": null, "rejectedById": null, "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-05-28 06:26:24.019
cmpp40ytw0015iafkxsjsnw09	cmplkm5x70000iaeg6ej70tgq	UPDATE	RoomReservation	cmpp40flj000xiafk3c3b50ct	{"id": "cmpp40flj000xiafk3c3b50ct", "room": {"id": "room_training", "name": "Training Room", "isActive": true, "createdAt": "2026-05-28T13:30:52.976Z", "updatedAt": "2026-05-28T13:30:52.976Z", "isAvailable": true, "unavailableReason": null}, "roomId": "room_training", "status": "PENDING", "endDate": "2026-06-02T16:00:00.000Z", "purpose": "Training for PhilSys", "remarks": null, "createdAt": "2026-05-28T06:26:01.592Z", "requester": {"id": "cmpmaayyh0049iausqyybqoai", "slug": "claudevan-a-macabale", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Claudevan A. Macabale", "isActive": true, "position": "SG 12 - Information System Analyst I**", "contactNo": "09696018203", "createdAt": "2026-05-26T06:58:52.409Z", "updatedAt": "2026-05-26T06:58:52.409Z", "employeeNo": "PSA1043-021", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}, "startDate": "2026-05-31T16:00:00.000Z", "updatedAt": "2026-05-28T06:26:24.005Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": null, "rejectedById": null, "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpp40flj000xiafk3c3b50ct", "roomId": "room_training", "status": "APPROVED", "endDate": "2026-06-02T16:00:00.000Z", "purpose": "Training for PhilSys", "remarks": null, "createdAt": "2026-05-28T06:26:01.592Z", "startDate": "2026-05-31T16:00:00.000Z", "updatedAt": "2026-05-28T06:26:26.491Z", "approvedAt": "2026-05-28T06:26:26.488Z", "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": "cmplkm5x70000iaeg6ej70tgq", "rejectedById": null, "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-05-28 06:26:26.516
cmpp5y1ca0003iavsj5c734o7	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp5y1c20001iavswnlk9g7q	\N	{"id": "cmpp5y1c20001iavswnlk9g7q", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:09.026Z", "updatedAt": "2026-05-28T07:20:09.026Z", "isGroupLead": false, "personnelId": "cmpm6z80v002viausbcqx3ozw", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:20:09.034
cmpp5ygs20007iavs42624ek7	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp5ygry0005iavszugd8qyc	\N	{"id": "cmpp5ygry0005iavszugd8qyc", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:29.039Z", "updatedAt": "2026-05-28T07:20:29.039Z", "isGroupLead": false, "personnelId": "cmpm7s7j8003liauswjjxk8ex", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:20:29.043
cmpp5ym50000biavs0k39ac8a	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp5ym4v0009iavs2l66v6n3	\N	{"id": "cmpp5ym4v0009iavs2l66v6n3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:35.983Z", "updatedAt": "2026-05-28T07:20:35.983Z", "isGroupLead": false, "personnelId": "cmpm7wjyu003riaus32ihl37b", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:20:35.988
cmpp5ytg3000fiavsrkm05qmn	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp5ytfw000diavs3l0qjvvb	\N	{"id": "cmpp5ytfw000diavs3l0qjvvb", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:45.453Z", "updatedAt": "2026-05-28T07:20:45.453Z", "isGroupLead": false, "personnelId": "cmpmamcwq004viaus5y4atq5q", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:20:45.459
cmpp5yz6c000jiavs01b3rr5i	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp5yz69000hiavs0c976igm	\N	{"id": "cmpp5yz69000hiavs0c976igm", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:52.881Z", "updatedAt": "2026-05-28T07:20:52.881Z", "isGroupLead": false, "personnelId": "cmpmaaekm0046iausrahtxbtp", "isTechnicalPerson": true}	\N	\N	2026-05-28 07:20:52.884
cmpp5z6ar000niavsihnawi69	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp5z6am000liavsnyozcdn3	\N	{"id": "cmpp5z6am000liavsnyozcdn3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:02.110Z", "updatedAt": "2026-05-28T07:21:02.110Z", "isGroupLead": false, "personnelId": "cmpmackhz004ciausks7jgn0o", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:21:02.115
cmpp60dxz000riavsp3vb251t	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp60dxv000piavs6mbey1qa	\N	{"id": "cmpp60dxv000piavs6mbey1qa", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:58.675Z", "updatedAt": "2026-05-28T07:21:58.675Z", "isGroupLead": false, "personnelId": "cmpmakc8i004liaus6oylw747", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:21:58.68
cmpp60j0s000viavsh1ic0jt9	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp60j0l000tiavsa62ofly7	\N	{"id": "cmpp60j0l000tiavsa62ofly7", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:05.253Z", "updatedAt": "2026-05-28T07:22:05.253Z", "isGroupLead": false, "personnelId": "cmpmcwkjj005niausxhpwr0rq", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:22:05.26
cmpp60on8000ziavskd2gjphv	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp60omz000xiavs833gvfu9	\N	{"id": "cmpp60omz000xiavs833gvfu9", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:12.539Z", "updatedAt": "2026-05-28T07:22:12.539Z", "isGroupLead": false, "personnelId": "cmpm70pwb002yiaus2m2fx6w0", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:22:12.548
cmpp613cv0013iavsmdrtrcg7	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp613cq0011iavs93c447pj	\N	{"id": "cmpp613cq0011iavs93c447pj", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:31.610Z", "updatedAt": "2026-05-28T07:22:31.610Z", "isGroupLead": false, "personnelId": "cmpmctto9005eiaus7jv5w8sw", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:22:31.615
cmpp61llw0017iavsitf8ldvc	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp61llq0015iavsjyr9e17j	\N	{"id": "cmpp61llq0015iavsjyr9e17j", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:55.263Z", "updatedAt": "2026-05-28T07:22:55.263Z", "isGroupLead": false, "personnelId": "cmpmcsydy005biaus8mz8wrn4", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:22:55.268
cmpp627nf001biavsooqy8ffp	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp627n70019iavskeseluyv	\N	{"id": "cmpp627n70019iavskeseluyv", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:23:23.828Z", "updatedAt": "2026-05-28T07:23:23.828Z", "isGroupLead": false, "personnelId": "cmpmcmiud0058iaustuwfw2sp", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:23:23.835
cmpp62r2k001fiavsvarhk3ep	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp62r2g001diavs55q1ml5d	\N	{"id": "cmpp62r2g001diavs55q1ml5d", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:23:49.000Z", "updatedAt": "2026-05-28T07:23:49.000Z", "isGroupLead": false, "personnelId": "cmpm6jzck002siausjij512h3", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:23:49.004
cmpp63nb9001jiavs7rs5k5d2	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp63nb1001hiavsww6zzdgv	\N	{"id": "cmpp63nb1001hiavsww6zzdgv", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:24:30.782Z", "updatedAt": "2026-05-28T07:24:30.782Z", "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:24:30.79
cmpp63teq001niavsoz6kcizm	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp63tel001liavse5tsxmig	\N	{"id": "cmpp63tel001liavse5tsxmig", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:24:38.685Z", "updatedAt": "2026-05-28T07:24:38.685Z", "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:24:38.69
cmpp646o4001viavsf4cm7deu	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp5ytfw000diavs3l0qjvvb	{"id": "cmpp5ytfw000diavs3l0qjvvb", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:45.453Z", "updatedAt": "2026-05-28T07:20:45.453Z", "isGroupLead": false, "personnelId": "cmpmamcwq004viaus5y4atq5q", "isTechnicalPerson": false}	{"id": "cmpp5ytfw000diavs3l0qjvvb", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:45.453Z", "updatedAt": "2026-05-28T07:24:55.872Z", "isGroupLead": false, "personnelId": "cmpmamcwq004viaus5y4atq5q", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:24:55.877
cmpp647hc001xiavsxjsqn0l9	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp5yz69000hiavs0c976igm	{"id": "cmpp5yz69000hiavs0c976igm", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:52.881Z", "updatedAt": "2026-05-28T07:20:52.881Z", "isGroupLead": false, "personnelId": "cmpmaaekm0046iausrahtxbtp", "isTechnicalPerson": true}	{"id": "cmpp5yz69000hiavs0c976igm", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:52.881Z", "updatedAt": "2026-05-28T07:24:56.923Z", "isGroupLead": false, "personnelId": "cmpmaaekm0046iausrahtxbtp", "isTechnicalPerson": true}	\N	\N	2026-05-28 07:24:56.928
cmpp64cu90029iavsa9j0vanh	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp61llq0015iavsjyr9e17j	{"id": "cmpp61llq0015iavsjyr9e17j", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:55.263Z", "updatedAt": "2026-05-28T07:22:55.263Z", "isGroupLead": false, "personnelId": "cmpmcsydy005biaus8mz8wrn4", "isTechnicalPerson": false}	{"id": "cmpp61llq0015iavsjyr9e17j", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:55.263Z", "updatedAt": "2026-05-28T07:25:03.867Z", "isGroupLead": false, "personnelId": "cmpmcsydy005biaus8mz8wrn4", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:25:03.873
cmpp648k5001ziavsi806xoyh	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp5z6am000liavsnyozcdn3	{"id": "cmpp5z6am000liavsnyozcdn3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:02.110Z", "updatedAt": "2026-05-28T07:21:02.110Z", "isGroupLead": false, "personnelId": "cmpmackhz004ciausks7jgn0o", "isTechnicalPerson": false}	{"id": "cmpp5z6am000liavsnyozcdn3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:02.110Z", "updatedAt": "2026-05-28T07:24:58.321Z", "isGroupLead": false, "personnelId": "cmpmackhz004ciausks7jgn0o", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:24:58.326
cmpp649s40021iavsax2j5gdx	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp60dxv000piavs6mbey1qa	{"id": "cmpp60dxv000piavs6mbey1qa", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:58.675Z", "updatedAt": "2026-05-28T07:21:58.675Z", "isGroupLead": false, "personnelId": "cmpmakc8i004liaus6oylw747", "isTechnicalPerson": false}	{"id": "cmpp60dxv000piavs6mbey1qa", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:58.675Z", "updatedAt": "2026-05-28T07:24:59.905Z", "isGroupLead": false, "personnelId": "cmpmakc8i004liaus6oylw747", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:24:59.908
cmpp64ai10023iavszkc6v14b	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp60j0l000tiavsa62ofly7	{"id": "cmpp60j0l000tiavsa62ofly7", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:05.253Z", "updatedAt": "2026-05-28T07:22:05.253Z", "isGroupLead": false, "personnelId": "cmpmcwkjj005niausxhpwr0rq", "isTechnicalPerson": false}	{"id": "cmpp60j0l000tiavsa62ofly7", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:05.253Z", "updatedAt": "2026-05-28T07:25:00.838Z", "isGroupLead": false, "personnelId": "cmpmcwkjj005niausxhpwr0rq", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:25:00.842
cmpp64b7r0025iavs0025gslb	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp60omz000xiavs833gvfu9	{"id": "cmpp60omz000xiavs833gvfu9", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:12.539Z", "updatedAt": "2026-05-28T07:22:12.539Z", "isGroupLead": false, "personnelId": "cmpm70pwb002yiaus2m2fx6w0", "isTechnicalPerson": false}	{"id": "cmpp60omz000xiavs833gvfu9", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:12.539Z", "updatedAt": "2026-05-28T07:25:01.761Z", "isGroupLead": false, "personnelId": "cmpm70pwb002yiaus2m2fx6w0", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:25:01.767
cmpp64c360027iavsvb8vwteb	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp613cq0011iavs93c447pj	{"id": "cmpp613cq0011iavs93c447pj", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:31.610Z", "updatedAt": "2026-05-28T07:22:31.610Z", "isGroupLead": false, "personnelId": "cmpmctto9005eiaus7jv5w8sw", "isTechnicalPerson": false}	{"id": "cmpp613cq0011iavs93c447pj", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:31.610Z", "updatedAt": "2026-05-28T07:25:02.895Z", "isGroupLead": false, "personnelId": "cmpmctto9005eiaus7jv5w8sw", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:25:02.898
cmpp64dwl002biavsoe5macdc	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMember	cmpp627n70019iavskeseluyv	{"id": "cmpp627n70019iavskeseluyv", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:23:23.828Z", "updatedAt": "2026-05-28T07:23:23.828Z", "isGroupLead": false, "personnelId": "cmpmcmiud0058iaustuwfw2sp", "isTechnicalPerson": false}	{"id": "cmpp627n70019iavskeseluyv", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:23:23.828Z", "updatedAt": "2026-05-28T07:25:05.247Z", "isGroupLead": false, "personnelId": "cmpmcmiud0058iaustuwfw2sp", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:25:05.253
cmpp64s60002fiavsmb412qst	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp64s5w002diavsjclp67le	\N	{"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T07:25:23.732Z", "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:25:23.737
cmpp6dbou002hiavsdhww8m80	cmplkm5x70000iaeg6ej70tgq	REMOVE	ConvocationGroupMember	cmpp64s5w002diavsjclp67le	{"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T07:25:23.732Z", "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": false}	{"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": false, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T07:32:02.280Z", "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:32:02.286
cmpp6gfwj002liavs8m9in2h0	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp6gfwb002jiavsryg1qicy	\N	{"id": "cmpp6gfwb002jiavsryg1qicy", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:27.708Z", "updatedAt": "2026-05-28T07:34:27.708Z", "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:34:27.715
cmpp6gpqv002piavs3kq8q1of	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp6gpqo002niavs9i1jkbjv	\N	{"id": "cmpp6gpqo002niavs9i1jkbjv", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:40.464Z", "updatedAt": "2026-05-28T07:34:40.464Z", "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:34:40.471
cmpp7b87h0003ialkkjj7wac8	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7b8790001ialkslptcvzg	\N	{"id": "cmpp7b8790001ialkslptcvzg", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:58:24.069Z", "updatedAt": "2026-05-28T07:58:24.069Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7y2d5003uiaushuvnjj0w", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:58:24.078
cmpp7cvfm0007ialktnpn1fgq	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7cvff0005ialkbl4q2i8b	\N	{"id": "cmpp7cvff0005ialkbl4q2i8b", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:59:40.827Z", "updatedAt": "2026-05-28T07:59:40.827Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm9wtav0040iaus5stdmg52", "isTechnicalPerson": false}	\N	\N	2026-05-28 07:59:40.834
cmpp7diio000bialkjiqqqkpb	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp64s5w002diavsjclp67le	\N	{"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T08:00:10.745Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:00:10.752
cmpp7kvvg000dialkb546opdf	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMembers	convocation_group_2	[{"id": "cmpp62r2g001diavs55q1ml5d", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:23:49.000Z", "updatedAt": "2026-05-28T07:23:49.000Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6jzck002siausjij512h3", "isTechnicalPerson": false}, {"id": "cmpp6gfwb002jiavsryg1qicy", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:27.708Z", "updatedAt": "2026-05-28T07:34:27.708Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp6gpqo002niavs9i1jkbjv", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:40.464Z", "updatedAt": "2026-05-28T07:34:40.464Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp7b8790001ialkslptcvzg", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:58:24.069Z", "updatedAt": "2026-05-28T07:58:24.069Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7y2d5003uiaushuvnjj0w", "isTechnicalPerson": false}, {"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T08:00:10.745Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": false}]	[{"id": "cmpp62r2g001diavs55q1ml5d", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:23:49.000Z", "updatedAt": "2026-05-28T08:05:54.639Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6jzck002siausjij512h3", "isTechnicalPerson": false}, {"id": "cmpp6gfwb002jiavsryg1qicy", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:27.708Z", "updatedAt": "2026-05-28T08:05:54.639Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp6gpqo002niavs9i1jkbjv", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:40.464Z", "updatedAt": "2026-05-28T08:05:54.639Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp7b8790001ialkslptcvzg", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:58:24.069Z", "updatedAt": "2026-05-28T08:05:54.639Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7y2d5003uiaushuvnjj0w", "isTechnicalPerson": false}, {"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T08:05:54.639Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": true}]	\N	\N	2026-05-28 08:05:54.652
cmpp7ld8i000hialkbrayeyqt	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7ld8e000fialkfju434gm	\N	{"id": "cmpp7ld8e000fialkfju434gm", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:17.150Z", "updatedAt": "2026-05-28T08:06:17.150Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmajetn004iiaus2vel52gz", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:06:17.155
cmpp7lk7w000lialkugf78q1d	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7lk7p000jialk41hvi6m2	\N	{"id": "cmpp7lk7p000jialk41hvi6m2", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:26.197Z", "updatedAt": "2026-05-28T08:06:26.197Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7z8kc003xiauswx84u6ek", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:06:26.204
cmpp7ln23000nialkm8web9x7	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMembers	convocation_group_2	[{"id": "cmpp62r2g001diavs55q1ml5d", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:23:49.000Z", "updatedAt": "2026-05-28T08:05:54.639Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6jzck002siausjij512h3", "isTechnicalPerson": false}, {"id": "cmpp6gfwb002jiavsryg1qicy", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:27.708Z", "updatedAt": "2026-05-28T08:05:54.639Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp6gpqo002niavs9i1jkbjv", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:40.464Z", "updatedAt": "2026-05-28T08:05:54.639Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp7b8790001ialkslptcvzg", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:58:24.069Z", "updatedAt": "2026-05-28T08:05:54.639Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7y2d5003uiaushuvnjj0w", "isTechnicalPerson": false}, {"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T08:05:54.639Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": true}, {"id": "cmpp7ld8e000fialkfju434gm", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:17.150Z", "updatedAt": "2026-05-28T08:06:17.150Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmajetn004iiaus2vel52gz", "isTechnicalPerson": false}, {"id": "cmpp7lk7p000jialk41hvi6m2", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:26.197Z", "updatedAt": "2026-05-28T08:06:26.197Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7z8kc003xiauswx84u6ek", "isTechnicalPerson": false}]	[{"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": true}, {"id": "cmpp62r2g001diavs55q1ml5d", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:23:49.000Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6jzck002siausjij512h3", "isTechnicalPerson": false}, {"id": "cmpp6gfwb002jiavsryg1qicy", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:27.708Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp6gpqo002niavs9i1jkbjv", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:40.464Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp7b8790001ialkslptcvzg", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:58:24.069Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7y2d5003uiaushuvnjj0w", "isTechnicalPerson": false}, {"id": "cmpp7ld8e000fialkfju434gm", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:17.150Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmajetn004iiaus2vel52gz", "isTechnicalPerson": false}, {"id": "cmpp7lk7p000jialk41hvi6m2", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:26.197Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7z8kc003xiauswx84u6ek", "isTechnicalPerson": false}]	\N	\N	2026-05-28 08:06:29.883
cmpp7lvp3000rialkduwpsrvn	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7lvoy000pialkir8es27b	\N	{"id": "cmpp7lvoy000pialkir8es27b", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:41.074Z", "updatedAt": "2026-05-28T08:06:41.074Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7rduc003iiausmprulwf1", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:06:41.08
cmpp7mz7e000vialkjapsgpa4	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7mz79000tialk6ovurw7e	\N	{"id": "cmpp7mz79000tialk6ovurw7e", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:32.278Z", "updatedAt": "2026-05-28T08:07:32.278Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcug27005hiauszp8pd7lt", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:07:32.282
cmpp7nbmk000zialkqq0o53zy	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7nbmg000xialk72a9un6t	\N	{"id": "cmpp7nbmg000xialk72a9un6t", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:48.376Z", "updatedAt": "2026-05-28T08:07:48.376Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcxxg5005qiausn9g2slk7", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:07:48.381
cmpp7nfqv0013ialk11w7ujth	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7nfqq0011ialkuj5jjv0u	\N	{"id": "cmpp7nfqq0011ialkuj5jjv0u", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:53.714Z", "updatedAt": "2026-05-28T08:07:53.714Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmbbun40051iaus0ypzmgo0", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:07:53.719
cmpp7nhsh0015ialk5bha6ppx	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMembers	convocation_group_2	[{"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": true}, {"id": "cmpp7lvoy000pialkir8es27b", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:41.074Z", "updatedAt": "2026-05-28T08:06:41.074Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7rduc003iiausmprulwf1", "isTechnicalPerson": false}, {"id": "cmpp7mz79000tialk6ovurw7e", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:32.278Z", "updatedAt": "2026-05-28T08:07:32.278Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcug27005hiauszp8pd7lt", "isTechnicalPerson": false}, {"id": "cmpp7nbmg000xialk72a9un6t", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:48.376Z", "updatedAt": "2026-05-28T08:07:48.376Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcxxg5005qiausn9g2slk7", "isTechnicalPerson": false}, {"id": "cmpp7nfqq0011ialkuj5jjv0u", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:53.714Z", "updatedAt": "2026-05-28T08:07:53.714Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmbbun40051iaus0ypzmgo0", "isTechnicalPerson": false}, {"id": "cmpp62r2g001diavs55q1ml5d", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:23:49.000Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6jzck002siausjij512h3", "isTechnicalPerson": false}, {"id": "cmpp6gfwb002jiavsryg1qicy", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:27.708Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp6gpqo002niavs9i1jkbjv", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:40.464Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp7b8790001ialkslptcvzg", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:58:24.069Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7y2d5003uiaushuvnjj0w", "isTechnicalPerson": false}, {"id": "cmpp7ld8e000fialkfju434gm", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:17.150Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmajetn004iiaus2vel52gz", "isTechnicalPerson": false}, {"id": "cmpp7lk7p000jialk41hvi6m2", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:26.197Z", "updatedAt": "2026-05-28T08:06:29.871Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7z8kc003xiauswx84u6ek", "isTechnicalPerson": false}]	[{"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": true}, {"id": "cmpp7lvoy000pialkir8es27b", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:41.074Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7rduc003iiausmprulwf1", "isTechnicalPerson": false}, {"id": "cmpp7mz79000tialk6ovurw7e", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:32.278Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcug27005hiauszp8pd7lt", "isTechnicalPerson": false}, {"id": "cmpp7nbmg000xialk72a9un6t", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:48.376Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcxxg5005qiausn9g2slk7", "isTechnicalPerson": false}, {"id": "cmpp7nfqq0011ialkuj5jjv0u", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:53.714Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmbbun40051iaus0ypzmgo0", "isTechnicalPerson": false}, {"id": "cmpp62r2g001diavs55q1ml5d", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:23:49.000Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6jzck002siausjij512h3", "isTechnicalPerson": false}, {"id": "cmpp6gfwb002jiavsryg1qicy", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:27.708Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp6gpqo002niavs9i1jkbjv", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:40.464Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp7b8790001ialkslptcvzg", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:58:24.069Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7y2d5003uiaushuvnjj0w", "isTechnicalPerson": false}, {"id": "cmpp7ld8e000fialkfju434gm", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:17.150Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmajetn004iiaus2vel52gz", "isTechnicalPerson": false}, {"id": "cmpp7lk7p000jialk41hvi6m2", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:26.197Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7z8kc003xiauswx84u6ek", "isTechnicalPerson": false}]	\N	\N	2026-05-28 08:07:56.369
cmpp7o25r0017ialkpqam5vs9	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMembers	convocation_group_1	[{"id": "cmpp63nb1001hiavsww6zzdgv", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:24:30.782Z", "updatedAt": "2026-05-28T07:24:30.782Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp63tel001liavse5tsxmig", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:24:38.685Z", "updatedAt": "2026-05-28T07:24:38.685Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp5y1c20001iavswnlk9g7q", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:09.026Z", "updatedAt": "2026-05-28T07:24:50.472Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6z80v002viausbcqx3ozw", "isTechnicalPerson": false}, {"id": "cmpp5ygry0005iavszugd8qyc", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:29.039Z", "updatedAt": "2026-05-28T07:24:52.378Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7s7j8003liauswjjxk8ex", "isTechnicalPerson": false}, {"id": "cmpp5ym4v0009iavs2l66v6n3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:35.983Z", "updatedAt": "2026-05-28T07:24:54.528Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7wjyu003riaus32ihl37b", "isTechnicalPerson": false}, {"id": "cmpp5ytfw000diavs3l0qjvvb", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:45.453Z", "updatedAt": "2026-05-28T07:24:55.872Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmamcwq004viaus5y4atq5q", "isTechnicalPerson": false}, {"id": "cmpp5yz69000hiavs0c976igm", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:52.881Z", "updatedAt": "2026-05-28T07:24:56.923Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaaekm0046iausrahtxbtp", "isTechnicalPerson": true}, {"id": "cmpp5z6am000liavsnyozcdn3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:02.110Z", "updatedAt": "2026-05-28T07:24:58.321Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmackhz004ciausks7jgn0o", "isTechnicalPerson": false}, {"id": "cmpp60dxv000piavs6mbey1qa", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:58.675Z", "updatedAt": "2026-05-28T07:24:59.905Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmakc8i004liaus6oylw747", "isTechnicalPerson": false}, {"id": "cmpp60j0l000tiavsa62ofly7", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:05.253Z", "updatedAt": "2026-05-28T07:25:00.838Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcwkjj005niausxhpwr0rq", "isTechnicalPerson": false}, {"id": "cmpp60omz000xiavs833gvfu9", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:12.539Z", "updatedAt": "2026-05-28T07:25:01.761Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm70pwb002yiaus2m2fx6w0", "isTechnicalPerson": false}, {"id": "cmpp613cq0011iavs93c447pj", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:31.610Z", "updatedAt": "2026-05-28T07:25:02.895Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmctto9005eiaus7jv5w8sw", "isTechnicalPerson": false}, {"id": "cmpp61llq0015iavsjyr9e17j", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:55.263Z", "updatedAt": "2026-05-28T07:25:03.867Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcsydy005biaus8mz8wrn4", "isTechnicalPerson": false}, {"id": "cmpp627n70019iavskeseluyv", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:23:23.828Z", "updatedAt": "2026-05-28T07:25:05.247Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcmiud0058iaustuwfw2sp", "isTechnicalPerson": false}, {"id": "cmpp7cvff0005ialkbl4q2i8b", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:59:40.827Z", "updatedAt": "2026-05-28T07:59:40.827Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm9wtav0040iaus5stdmg52", "isTechnicalPerson": false}]	[{"id": "cmpp63nb1001hiavsww6zzdgv", "groupId": "convocation_group_1", "isActive": false, "createdAt": "2026-05-28T07:24:30.782Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": false, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp63tel001liavse5tsxmig", "groupId": "convocation_group_1", "isActive": false, "createdAt": "2026-05-28T07:24:38.685Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": false, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp5y1c20001iavswnlk9g7q", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:09.026Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6z80v002viausbcqx3ozw", "isTechnicalPerson": false}, {"id": "cmpp5ygry0005iavszugd8qyc", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:29.039Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7s7j8003liauswjjxk8ex", "isTechnicalPerson": false}, {"id": "cmpp5ym4v0009iavs2l66v6n3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:35.983Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7wjyu003riaus32ihl37b", "isTechnicalPerson": false}, {"id": "cmpp5ytfw000diavs3l0qjvvb", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:45.453Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmamcwq004viaus5y4atq5q", "isTechnicalPerson": false}, {"id": "cmpp5z6am000liavsnyozcdn3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:02.110Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmackhz004ciausks7jgn0o", "isTechnicalPerson": false}, {"id": "cmpp60dxv000piavs6mbey1qa", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:58.675Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmakc8i004liaus6oylw747", "isTechnicalPerson": false}, {"id": "cmpp60j0l000tiavsa62ofly7", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:05.253Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcwkjj005niausxhpwr0rq", "isTechnicalPerson": false}, {"id": "cmpp60omz000xiavs833gvfu9", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:12.539Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm70pwb002yiaus2m2fx6w0", "isTechnicalPerson": false}, {"id": "cmpp613cq0011iavs93c447pj", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:31.610Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmctto9005eiaus7jv5w8sw", "isTechnicalPerson": false}, {"id": "cmpp61llq0015iavsjyr9e17j", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:55.263Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcsydy005biaus8mz8wrn4", "isTechnicalPerson": false}, {"id": "cmpp627n70019iavskeseluyv", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:23:23.828Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcmiud0058iaustuwfw2sp", "isTechnicalPerson": false}, {"id": "cmpp5yz69000hiavs0c976igm", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:52.881Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaaekm0046iausrahtxbtp", "isTechnicalPerson": true}, {"id": "cmpp7cvff0005ialkbl4q2i8b", "groupId": "convocation_group_1", "isActive": false, "createdAt": "2026-05-28T07:59:40.827Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": false, "isGroupLead": false, "personnelId": "cmpm9wtav0040iaus5stdmg52", "isTechnicalPerson": false}]	\N	\N	2026-05-28 08:08:22.768
cmpp7odri001bialkruj3o9vv	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7odra0019ialkmk20qzu1	\N	{"id": "cmpp7odra0019ialkmk20qzu1", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:08:37.798Z", "updatedAt": "2026-05-28T08:08:37.798Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm9wtav0040iaus5stdmg52", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:08:37.806
cmpp7oh2j001dialkoopjjorh	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMembers	convocation_group_2	[{"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": true}, {"id": "cmpp7lvoy000pialkir8es27b", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:41.074Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7rduc003iiausmprulwf1", "isTechnicalPerson": false}, {"id": "cmpp7mz79000tialk6ovurw7e", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:32.278Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcug27005hiauszp8pd7lt", "isTechnicalPerson": false}, {"id": "cmpp7nbmg000xialk72a9un6t", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:48.376Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcxxg5005qiausn9g2slk7", "isTechnicalPerson": false}, {"id": "cmpp7nfqq0011ialkuj5jjv0u", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:53.714Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmbbun40051iaus0ypzmgo0", "isTechnicalPerson": false}, {"id": "cmpp62r2g001diavs55q1ml5d", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:23:49.000Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6jzck002siausjij512h3", "isTechnicalPerson": false}, {"id": "cmpp6gfwb002jiavsryg1qicy", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:27.708Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp6gpqo002niavs9i1jkbjv", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:40.464Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp7b8790001ialkslptcvzg", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:58:24.069Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7y2d5003uiaushuvnjj0w", "isTechnicalPerson": false}, {"id": "cmpp7ld8e000fialkfju434gm", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:17.150Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmajetn004iiaus2vel52gz", "isTechnicalPerson": false}, {"id": "cmpp7lk7p000jialk41hvi6m2", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:26.197Z", "updatedAt": "2026-05-28T08:07:56.353Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7z8kc003xiauswx84u6ek", "isTechnicalPerson": false}, {"id": "cmpp7odra0019ialkmk20qzu1", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:08:37.798Z", "updatedAt": "2026-05-28T08:08:37.798Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm9wtav0040iaus5stdmg52", "isTechnicalPerson": false}]	[{"id": "cmpp7lvoy000pialkir8es27b", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:41.074Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7rduc003iiausmprulwf1", "isTechnicalPerson": false}, {"id": "cmpp7mz79000tialk6ovurw7e", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:32.278Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcug27005hiauszp8pd7lt", "isTechnicalPerson": false}, {"id": "cmpp7nbmg000xialk72a9un6t", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:48.376Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcxxg5005qiausn9g2slk7", "isTechnicalPerson": false}, {"id": "cmpp7nfqq0011ialkuj5jjv0u", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:07:53.714Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmbbun40051iaus0ypzmgo0", "isTechnicalPerson": false}, {"id": "cmpp62r2g001diavs55q1ml5d", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:23:49.000Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6jzck002siausjij512h3", "isTechnicalPerson": false}, {"id": "cmpp6gfwb002jiavsryg1qicy", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:27.708Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp64s5w002diavsjclp67le", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:25:23.732Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaayyh0049iausqyybqoai", "isTechnicalPerson": true}, {"id": "cmpp6gpqo002niavs9i1jkbjv", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:34:40.464Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp7b8790001ialkslptcvzg", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T07:58:24.069Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7y2d5003uiaushuvnjj0w", "isTechnicalPerson": false}, {"id": "cmpp7ld8e000fialkfju434gm", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:17.150Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmajetn004iiaus2vel52gz", "isTechnicalPerson": false}, {"id": "cmpp7lk7p000jialk41hvi6m2", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:06:26.197Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7z8kc003xiauswx84u6ek", "isTechnicalPerson": false}, {"id": "cmpp7odra0019ialkmk20qzu1", "groupId": "convocation_group_2", "isActive": true, "createdAt": "2026-05-28T08:08:37.798Z", "updatedAt": "2026-05-28T08:08:42.077Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm9wtav0040iaus5stdmg52", "isTechnicalPerson": false}]	\N	\N	2026-05-28 08:08:42.091
cmpp7ozcd001hialkk7xhvm6i	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7ozc7001fialkmfmfijyp	\N	{"id": "cmpp7ozc7001fialkmfmfijyp", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:05.768Z", "updatedAt": "2026-05-28T08:09:05.768Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm4p7n6001qiausf4s5ahht", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:09:05.773
cmpp7p3m1001jialkyafnblom	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMembers	convocation_group_3	[{"id": "cmpp7ozc7001fialkmfmfijyp", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:05.768Z", "updatedAt": "2026-05-28T08:09:05.768Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm4p7n6001qiausf4s5ahht", "isTechnicalPerson": false}]	[{"id": "cmpp7ozc7001fialkmfmfijyp", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:05.768Z", "updatedAt": "2026-05-28T08:09:11.296Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm4p7n6001qiausf4s5ahht", "isTechnicalPerson": false}]	\N	\N	2026-05-28 08:09:11.306
cmpp7pg05001nialkmsziigw6	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7pg00001lialkfzv6wl7t	\N	{"id": "cmpp7pg00001lialkfzv6wl7t", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:27.360Z", "updatedAt": "2026-05-28T08:09:27.360Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7p9r4003ciausxxtm77m0", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:09:27.366
cmpp7pkbb001rialkj5ofvizg	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7pkb6001pialky084zgsu	\N	{"id": "cmpp7pkb6001pialky084zgsu", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:32.946Z", "updatedAt": "2026-05-28T08:09:32.946Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7nh3s0036iausxm44cu9t", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:09:32.951
cmpp7pob9001vialk2c3ehmif	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7pob5001tialkeshxbi49	\N	{"id": "cmpp7pob5001tialkeshxbi49", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:38.129Z", "updatedAt": "2026-05-28T08:09:38.129Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpma9o460043iausnsgkdz9b", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:09:38.134
cmpp7prmv001zialkxxm0u4mx	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7prmr001xialknllpftuu	\N	{"id": "cmpp7prmr001xialknllpftuu", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:42.435Z", "updatedAt": "2026-05-28T08:09:42.435Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmalk2l004qiausp3pm1z6f", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:09:42.44
cmpp7puvh0023ialkebexv1s0	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7puvd0021ialkux8h3kua	\N	{"id": "cmpp7puvd0021ialkux8h3kua", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:46.633Z", "updatedAt": "2026-05-28T08:09:46.633Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmain42004fiaus2twkusb1", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:09:46.637
cmpp7qnbi0027ialk1iibfui4	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7qnbc0025ialkywk028h4	\N	{"id": "cmpp7qnbc0025ialkywk028h4", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:23.496Z", "updatedAt": "2026-05-28T08:10:23.496Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7q17h003fiausimucssfj", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:10:23.502
cmpp7qr7b002bialkhe0lvy3t	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7qr750029ialk7ll03783	\N	{"id": "cmpp7qr750029ialk7ll03783", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:28.530Z", "updatedAt": "2026-05-28T08:10:28.530Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmczbk0005wiausmycr3jbp", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:10:28.535
cmpp7qv94002fialk1oau8xkn	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7qv91002dialkn765mq1t	\N	{"id": "cmpp7qv91002dialkn765mq1t", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:33.781Z", "updatedAt": "2026-05-28T08:10:33.781Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7nzmm0039iauss19l621g", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:10:33.784
cmpp7r1ub002jialk1ar4uhk7	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7r1u4002hialki9voa59k	\N	{"id": "cmpp7r1u4002hialki9voa59k", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:42.316Z", "updatedAt": "2026-05-28T08:10:42.316Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcyll0005tiaus9udmpd06", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:10:42.323
cmpp7r3n8002nialkj8dylgg1	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7r3n4002lialk732577zb	\N	{"id": "cmpp7r3n4002lialk732577zb", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:44.656Z", "updatedAt": "2026-05-28T08:10:44.656Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmanuku004yiaush28acnzm", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:10:44.66
cmpp7r96i002rialkbdqq559l	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7r96d002pialkwit2p2qf	\N	{"id": "cmpp7r96d002pialkwit2p2qf", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:51.829Z", "updatedAt": "2026-05-28T08:10:51.829Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcv3uk005kiausndde2tr6", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:10:51.834
cmpp7rgss002vialk9fx2j3v8	cmplkm5x70000iaeg6ej70tgq	UPSERT	ConvocationGroupMember	cmpp7rgsn002tialk02f8fbdc	\N	{"id": "cmpp7rgsn002tialk02f8fbdc", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:11:01.703Z", "updatedAt": "2026-05-28T08:11:01.703Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmd0y8g005ziausnc38ns1g", "isTechnicalPerson": false}	\N	\N	2026-05-28 08:11:01.708
cmpp7ribe002xialkmq7t8524	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMembers	convocation_group_3	[{"id": "cmpp7ozc7001fialkmfmfijyp", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:05.768Z", "updatedAt": "2026-05-28T08:09:11.296Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm4p7n6001qiausf4s5ahht", "isTechnicalPerson": false}, {"id": "cmpp7pg00001lialkfzv6wl7t", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:27.360Z", "updatedAt": "2026-05-28T08:09:27.360Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7p9r4003ciausxxtm77m0", "isTechnicalPerson": false}, {"id": "cmpp7pkb6001pialky084zgsu", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:32.946Z", "updatedAt": "2026-05-28T08:09:32.946Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7nh3s0036iausxm44cu9t", "isTechnicalPerson": false}, {"id": "cmpp7pob5001tialkeshxbi49", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:38.129Z", "updatedAt": "2026-05-28T08:09:38.129Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpma9o460043iausnsgkdz9b", "isTechnicalPerson": false}, {"id": "cmpp7prmr001xialknllpftuu", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:42.435Z", "updatedAt": "2026-05-28T08:09:42.435Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmalk2l004qiausp3pm1z6f", "isTechnicalPerson": false}, {"id": "cmpp7puvd0021ialkux8h3kua", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:46.633Z", "updatedAt": "2026-05-28T08:09:46.633Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmain42004fiaus2twkusb1", "isTechnicalPerson": false}, {"id": "cmpp7qnbc0025ialkywk028h4", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:23.496Z", "updatedAt": "2026-05-28T08:10:23.496Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7q17h003fiausimucssfj", "isTechnicalPerson": false}, {"id": "cmpp7qr750029ialk7ll03783", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:28.530Z", "updatedAt": "2026-05-28T08:10:28.530Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmczbk0005wiausmycr3jbp", "isTechnicalPerson": false}, {"id": "cmpp7qv91002dialkn765mq1t", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:33.781Z", "updatedAt": "2026-05-28T08:10:33.781Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7nzmm0039iauss19l621g", "isTechnicalPerson": false}, {"id": "cmpp7r1u4002hialki9voa59k", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:42.316Z", "updatedAt": "2026-05-28T08:10:42.316Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcyll0005tiaus9udmpd06", "isTechnicalPerson": false}, {"id": "cmpp7r3n4002lialk732577zb", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:44.656Z", "updatedAt": "2026-05-28T08:10:44.656Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmanuku004yiaush28acnzm", "isTechnicalPerson": false}, {"id": "cmpp7r96d002pialkwit2p2qf", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:51.829Z", "updatedAt": "2026-05-28T08:10:51.829Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcv3uk005kiausndde2tr6", "isTechnicalPerson": false}, {"id": "cmpp7rgsn002tialk02f8fbdc", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:11:01.703Z", "updatedAt": "2026-05-28T08:11:01.703Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmd0y8g005ziausnc38ns1g", "isTechnicalPerson": false}]	[{"id": "cmpp7ozc7001fialkmfmfijyp", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:05.768Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm4p7n6001qiausf4s5ahht", "isTechnicalPerson": false}, {"id": "cmpp7pg00001lialkfzv6wl7t", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:27.360Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7p9r4003ciausxxtm77m0", "isTechnicalPerson": false}, {"id": "cmpp7pkb6001pialky084zgsu", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:32.946Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7nh3s0036iausxm44cu9t", "isTechnicalPerson": false}, {"id": "cmpp7pob5001tialkeshxbi49", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:38.129Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpma9o460043iausnsgkdz9b", "isTechnicalPerson": false}, {"id": "cmpp7prmr001xialknllpftuu", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:42.435Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmalk2l004qiausp3pm1z6f", "isTechnicalPerson": false}, {"id": "cmpp7puvd0021ialkux8h3kua", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:46.633Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmain42004fiaus2twkusb1", "isTechnicalPerson": false}, {"id": "cmpp7qnbc0025ialkywk028h4", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:23.496Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7q17h003fiausimucssfj", "isTechnicalPerson": false}, {"id": "cmpp7qr750029ialk7ll03783", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:28.530Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmczbk0005wiausmycr3jbp", "isTechnicalPerson": false}, {"id": "cmpp7qv91002dialkn765mq1t", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:33.781Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7nzmm0039iauss19l621g", "isTechnicalPerson": false}, {"id": "cmpp7r1u4002hialki9voa59k", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:42.316Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcyll0005tiaus9udmpd06", "isTechnicalPerson": false}, {"id": "cmpp7r3n4002lialk732577zb", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:44.656Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmanuku004yiaush28acnzm", "isTechnicalPerson": false}, {"id": "cmpp7r96d002pialkwit2p2qf", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:51.829Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcv3uk005kiausndde2tr6", "isTechnicalPerson": false}, {"id": "cmpp7rgsn002tialk02f8fbdc", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:11:01.703Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmd0y8g005ziausnc38ns1g", "isTechnicalPerson": false}]	\N	\N	2026-05-28 08:11:03.674
cmpp7vgg7002zialk4pzfzabr	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMembers	convocation_group_1	[{"id": "cmpp63nb1001hiavsww6zzdgv", "groupId": "convocation_group_1", "isActive": false, "createdAt": "2026-05-28T07:24:30.782Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": false, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp63tel001liavse5tsxmig", "groupId": "convocation_group_1", "isActive": false, "createdAt": "2026-05-28T07:24:38.685Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": false, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp5y1c20001iavswnlk9g7q", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:09.026Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6z80v002viausbcqx3ozw", "isTechnicalPerson": false}, {"id": "cmpp5ygry0005iavszugd8qyc", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:29.039Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7s7j8003liauswjjxk8ex", "isTechnicalPerson": false}, {"id": "cmpp5ym4v0009iavs2l66v6n3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:35.983Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7wjyu003riaus32ihl37b", "isTechnicalPerson": false}, {"id": "cmpp5ytfw000diavs3l0qjvvb", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:45.453Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmamcwq004viaus5y4atq5q", "isTechnicalPerson": false}, {"id": "cmpp5z6am000liavsnyozcdn3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:02.110Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmackhz004ciausks7jgn0o", "isTechnicalPerson": false}, {"id": "cmpp60dxv000piavs6mbey1qa", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:58.675Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmakc8i004liaus6oylw747", "isTechnicalPerson": false}, {"id": "cmpp60j0l000tiavsa62ofly7", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:05.253Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcwkjj005niausxhpwr0rq", "isTechnicalPerson": false}, {"id": "cmpp60omz000xiavs833gvfu9", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:12.539Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm70pwb002yiaus2m2fx6w0", "isTechnicalPerson": false}, {"id": "cmpp613cq0011iavs93c447pj", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:31.610Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmctto9005eiaus7jv5w8sw", "isTechnicalPerson": false}, {"id": "cmpp61llq0015iavsjyr9e17j", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:55.263Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcsydy005biaus8mz8wrn4", "isTechnicalPerson": false}, {"id": "cmpp627n70019iavskeseluyv", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:23:23.828Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcmiud0058iaustuwfw2sp", "isTechnicalPerson": false}, {"id": "cmpp5yz69000hiavs0c976igm", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:52.881Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaaekm0046iausrahtxbtp", "isTechnicalPerson": true}, {"id": "cmpp7cvff0005ialkbl4q2i8b", "groupId": "convocation_group_1", "isActive": false, "createdAt": "2026-05-28T07:59:40.827Z", "updatedAt": "2026-05-28T08:08:22.752Z", "isAvailable": false, "isGroupLead": false, "personnelId": "cmpm9wtav0040iaus5stdmg52", "isTechnicalPerson": false}]	[{"id": "cmpp63nb1001hiavsww6zzdgv", "groupId": "convocation_group_1", "isActive": false, "createdAt": "2026-05-28T07:24:30.782Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm71afq0031iausuxhheoyf", "isTechnicalPerson": false}, {"id": "cmpp63tel001liavse5tsxmig", "groupId": "convocation_group_1", "isActive": false, "createdAt": "2026-05-28T07:24:38.685Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7sv69003oiausjksd398m", "isTechnicalPerson": false}, {"id": "cmpp5ym4v0009iavs2l66v6n3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:35.983Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": false, "isGroupLead": false, "personnelId": "cmpm7wjyu003riaus32ihl37b", "isTechnicalPerson": false}, {"id": "cmpp5y1c20001iavswnlk9g7q", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:09.026Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm6z80v002viausbcqx3ozw", "isTechnicalPerson": false}, {"id": "cmpp5ygry0005iavszugd8qyc", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:29.039Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7s7j8003liauswjjxk8ex", "isTechnicalPerson": false}, {"id": "cmpp5ytfw000diavs3l0qjvvb", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:45.453Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmamcwq004viaus5y4atq5q", "isTechnicalPerson": false}, {"id": "cmpp5z6am000liavsnyozcdn3", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:02.110Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmackhz004ciausks7jgn0o", "isTechnicalPerson": false}, {"id": "cmpp60dxv000piavs6mbey1qa", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:21:58.675Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmakc8i004liaus6oylw747", "isTechnicalPerson": false}, {"id": "cmpp60j0l000tiavsa62ofly7", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:05.253Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcwkjj005niausxhpwr0rq", "isTechnicalPerson": false}, {"id": "cmpp60omz000xiavs833gvfu9", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:12.539Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm70pwb002yiaus2m2fx6w0", "isTechnicalPerson": false}, {"id": "cmpp613cq0011iavs93c447pj", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:31.610Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmctto9005eiaus7jv5w8sw", "isTechnicalPerson": false}, {"id": "cmpp61llq0015iavsjyr9e17j", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:22:55.263Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcsydy005biaus8mz8wrn4", "isTechnicalPerson": false}, {"id": "cmpp627n70019iavskeseluyv", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:23:23.828Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcmiud0058iaustuwfw2sp", "isTechnicalPerson": false}, {"id": "cmpp5yz69000hiavs0c976igm", "groupId": "convocation_group_1", "isActive": true, "createdAt": "2026-05-28T07:20:52.881Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmaaekm0046iausrahtxbtp", "isTechnicalPerson": true}, {"id": "cmpp7cvff0005ialkbl4q2i8b", "groupId": "convocation_group_1", "isActive": false, "createdAt": "2026-05-28T07:59:40.827Z", "updatedAt": "2026-05-28T08:14:07.864Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm9wtav0040iaus5stdmg52", "isTechnicalPerson": false}]	\N	\N	2026-05-28 08:14:07.879
cmpp7vpxa0031ialkt9earfvo	cmplkm5x70000iaeg6ej70tgq	UPDATE	ConvocationGroupMembers	convocation_group_3	[{"id": "cmpp7ozc7001fialkmfmfijyp", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:05.768Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm4p7n6001qiausf4s5ahht", "isTechnicalPerson": false}, {"id": "cmpp7pg00001lialkfzv6wl7t", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:27.360Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7p9r4003ciausxxtm77m0", "isTechnicalPerson": false}, {"id": "cmpp7pkb6001pialky084zgsu", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:32.946Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7nh3s0036iausxm44cu9t", "isTechnicalPerson": false}, {"id": "cmpp7pob5001tialkeshxbi49", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:38.129Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpma9o460043iausnsgkdz9b", "isTechnicalPerson": false}, {"id": "cmpp7prmr001xialknllpftuu", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:42.435Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmalk2l004qiausp3pm1z6f", "isTechnicalPerson": false}, {"id": "cmpp7puvd0021ialkux8h3kua", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:46.633Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmain42004fiaus2twkusb1", "isTechnicalPerson": false}, {"id": "cmpp7qnbc0025ialkywk028h4", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:23.496Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7q17h003fiausimucssfj", "isTechnicalPerson": false}, {"id": "cmpp7qr750029ialk7ll03783", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:28.530Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmczbk0005wiausmycr3jbp", "isTechnicalPerson": false}, {"id": "cmpp7qv91002dialkn765mq1t", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:33.781Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7nzmm0039iauss19l621g", "isTechnicalPerson": false}, {"id": "cmpp7r1u4002hialki9voa59k", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:42.316Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcyll0005tiaus9udmpd06", "isTechnicalPerson": false}, {"id": "cmpp7r3n4002lialk732577zb", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:44.656Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmanuku004yiaush28acnzm", "isTechnicalPerson": false}, {"id": "cmpp7r96d002pialkwit2p2qf", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:51.829Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcv3uk005kiausndde2tr6", "isTechnicalPerson": false}, {"id": "cmpp7rgsn002tialk02f8fbdc", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:11:01.703Z", "updatedAt": "2026-05-28T08:11:03.663Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmd0y8g005ziausnc38ns1g", "isTechnicalPerson": false}]	[{"id": "cmpp7ozc7001fialkmfmfijyp", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:05.768Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm4p7n6001qiausf4s5ahht", "isTechnicalPerson": false}, {"id": "cmpp7pg00001lialkfzv6wl7t", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:27.360Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7p9r4003ciausxxtm77m0", "isTechnicalPerson": false}, {"id": "cmpp7pkb6001pialky084zgsu", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:32.946Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7nh3s0036iausxm44cu9t", "isTechnicalPerson": false}, {"id": "cmpp7pob5001tialkeshxbi49", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:38.129Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpma9o460043iausnsgkdz9b", "isTechnicalPerson": false}, {"id": "cmpp7prmr001xialknllpftuu", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:42.435Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmalk2l004qiausp3pm1z6f", "isTechnicalPerson": false}, {"id": "cmpp7puvd0021ialkux8h3kua", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:09:46.633Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmain42004fiaus2twkusb1", "isTechnicalPerson": false}, {"id": "cmpp7qnbc0025ialkywk028h4", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:23.496Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7q17h003fiausimucssfj", "isTechnicalPerson": false}, {"id": "cmpp7qr750029ialk7ll03783", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:28.530Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmczbk0005wiausmycr3jbp", "isTechnicalPerson": false}, {"id": "cmpp7qv91002dialkn765mq1t", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:33.781Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpm7nzmm0039iauss19l621g", "isTechnicalPerson": false}, {"id": "cmpp7r1u4002hialki9voa59k", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:42.316Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcyll0005tiaus9udmpd06", "isTechnicalPerson": false}, {"id": "cmpp7r3n4002lialk732577zb", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:44.656Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmanuku004yiaush28acnzm", "isTechnicalPerson": false}, {"id": "cmpp7rgsn002tialk02f8fbdc", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:11:01.703Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmd0y8g005ziausnc38ns1g", "isTechnicalPerson": false}, {"id": "cmpp7r96d002pialkwit2p2qf", "groupId": "convocation_group_3", "isActive": true, "createdAt": "2026-05-28T08:10:51.829Z", "updatedAt": "2026-05-28T08:14:20.145Z", "isAvailable": true, "isGroupLead": false, "personnelId": "cmpmcv3uk005kiausndde2tr6", "isTechnicalPerson": true}]	\N	\N	2026-05-28 08:14:20.158
cmpp8oomk0003iap4lfpfmt8n	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmpp8oomc0001iap44h6gpnob	\N	{"id": "cmpp8oomc0001iap44h6gpnob", "name": "Angel Marie Guillena", "role": "ADMIN", "email": null, "section": "Administrative and Accounting", "isActive": true, "username": "a.guillena", "createdAt": "2026-05-28T08:36:51.492Z", "updatedAt": "2026-05-28T08:36:51.492Z", "employeeId": "PSA1043-030", "lastLoginAt": null, "personnelId": "cmpmcmiud0058iaustuwfw2sp", "passwordHash": "$2b$12$NeZBoX3seSCxX4JGBlTKMupJaGaIlxwrFU5Ol0mro5rvTYH2A/hiW", "mustChangePassword": true}	\N	\N	2026-05-28 08:36:51.5
cmpp8tlo8000iiap4wcp2bgj9	cmplkm5x70000iaeg6ej70tgq	CREATE	ConvocationProgram	cmpp8tlnp0005iap48q5qcc4q	\N	{"id": "cmpp8tlnp0005iap48q5qcc4q", "notes": null, "status": "DRAFT", "groupId": "convocation_group_2", "createdAt": "2026-05-28T08:40:40.934Z", "printedAt": null, "updatedAt": "2026-05-28T08:40:40.934Z", "finalizedAt": null, "finalizedById": null, "generatedById": "cmplkm5x70000iaeg6ej70tgq", "convocationDate": "2026-05-31T16:00:00.000Z", "calendarActivityId": null}	\N	\N	2026-05-28 08:40:40.952
cmpp8yusi000wiap4ks1504yi	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmpp8tlnp0005iap48q5qcc4q	\N	{"status": "FINALIZED"}	\N	\N	2026-05-28 08:44:46.051
cmpp9i1g1000yiap4vcvlvuca	cmpp8oomc0001iap44h6gpnob	LOGIN	User	cmpp8oomc0001iap44h6gpnob	\N	\N	\N	\N	2026-05-28 08:59:41.138
cmpp9i4of0010iap4hpdjijcc	cmpp8oomc0001iap44h6gpnob	LOGIN	User	cmpp8oomc0001iap44h6gpnob	\N	\N	\N	\N	2026-05-28 08:59:45.327
cmpp9k8tz0012iap49m1tkglz	cmpp8oomc0001iap44h6gpnob	UPDATE_PASSWORD	User	cmpp8oomc0001iap44h6gpnob	\N	\N	\N	\N	2026-05-28 09:01:24.023
cmpp9l49r001hiap4oukxj0q1	cmpp8oomc0001iap44h6gpnob	CREATE	ConvocationProgram	cmpp9l49h0014iap4eu26obqq	\N	{"id": "cmpp9l49h0014iap4eu26obqq", "notes": null, "status": "DRAFT", "groupId": "convocation_group_3", "createdAt": "2026-05-28T09:02:04.757Z", "printedAt": null, "updatedAt": "2026-05-28T09:02:04.757Z", "finalizedAt": null, "finalizedById": null, "generatedById": "cmpp8oomc0001iap44h6gpnob", "convocationDate": "2026-06-07T16:00:00.000Z", "calendarActivityId": null}	\N	\N	2026-05-28 09:02:04.768
cmpp9wexr001jiap46e19vrwr	cmplkm5x70000iaeg6ej70tgq	DELETE_UPCOMING	ConvocationProgram	cmpp9l49h0014iap4eu26obqq	{"id": "cmpp9l49h0014iap4eu26obqq", "notes": null, "status": "DRAFT", "groupId": "convocation_group_3", "createdAt": "2026-05-28T09:02:04.757Z", "printedAt": null, "updatedAt": "2026-05-28T09:02:04.757Z", "finalizedAt": null, "finalizedById": null, "generatedById": "cmpp8oomc0001iap44h6gpnob", "convocationDate": "2026-06-07T16:00:00.000Z", "calendarActivityId": null}	{"id": "cmpp9l49h0014iap4eu26obqq", "notes": null, "status": "ARCHIVED", "groupId": "convocation_group_3", "createdAt": "2026-05-28T09:02:04.757Z", "printedAt": null, "updatedAt": "2026-05-28T09:10:51.801Z", "finalizedAt": null, "finalizedById": null, "generatedById": "cmpp8oomc0001iap44h6gpnob", "convocationDate": "2026-06-07T16:00:00.000Z", "calendarActivityId": null}	\N	\N	2026-05-28 09:10:51.808
cmppa2gt3001niap43admwrsa	cmplkm5x70000iaeg6ej70tgq	AUTO_REPLACE	ConvocationProgramItem	cmpp8tlnq000ciap4i36o28m7	{"rotationKey": "psa_vision_mission_values", "assignmentMode": "ASSIGNABLE", "assignedPersonnelId": "cmpmcxxg5005qiausn9g2slk7"}	{"rotationKey": "psa_vision_mission_values", "assignmentMode": "OVERRIDDEN", "assignedPersonnelId": "cmpm7rduc003iiausmprulwf1"}	\N	\N	2026-05-28 09:15:34.168
cmppa2que001riap4y0t4rlr1	cmplkm5x70000iaeg6ej70tgq	AUTO_REPLACE	ConvocationProgramItem	cmpp8tlnq000ciap4i36o28m7	{"rotationKey": "psa_vision_mission_values", "assignmentMode": "OVERRIDDEN", "assignedPersonnelId": "cmpm7rduc003iiausmprulwf1"}	{"rotationKey": "psa_vision_mission_values", "assignmentMode": "OVERRIDDEN", "assignedPersonnelId": "cmpmbbun40051iaus0ypzmgo0"}	\N	\N	2026-05-28 09:15:47.174
cmppa2t09001viap46lu4g9ew	cmplkm5x70000iaeg6ej70tgq	AUTO_REPLACE	ConvocationProgramItem	cmpp8tlnq000ciap4i36o28m7	{"rotationKey": "psa_vision_mission_values", "assignmentMode": "OVERRIDDEN", "assignedPersonnelId": "cmpmbbun40051iaus0ypzmgo0"}	{"rotationKey": "psa_vision_mission_values", "assignmentMode": "OVERRIDDEN", "assignedPersonnelId": "cmpmcug27005hiauszp8pd7lt"}	\N	\N	2026-05-28 09:15:49.977
cmppar91e001xiap4g3h1h1qx	cmpp8oomc0001iap44h6gpnob	LOGOUT	User	cmpp8oomc0001iap44h6gpnob	\N	\N	\N	\N	2026-05-28 09:34:50.498
cmpplfsir0001iazw8mzpn1dd	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-28 14:33:51.651
cmpplftij0003iazwymuapjye	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-28 14:33:52.939
cmpq6pu9s0001iaqs9m61c5tz	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-29 00:29:32.414
cmpqbr4ro0003iabw11hezyzc	cmplkm5x70000iaeg6ej70tgq	CREATE	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	\N	{"id": "cmpqbr4rd0001iabw1uigllqf", "name": "Flag Ceremony Program", "fileUrl": "/uploads/pdf-templates/1780023030727-Convocation_Program.pdf", "fieldMap": {"fields": [], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}, "fileName": "Convocation Program.pdf", "isActive": true, "createdAt": "2026-05-29T02:50:30.745Z", "pageCount": 2, "updatedAt": "2026-05-29T02:50:30.745Z", "createdById": "cmplkm5x70000iaeg6ej70tgq", "description": null, "templateFeature": "CONVOCATION_PROGRAM"}	\N	\N	2026-05-29 02:50:30.757
cmpqbt0bx0005iabwq13x7z0l	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 523, "y": 512, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 11, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 02:51:58.317
cmpqcxtsg000bia4w5nwwew85	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmpp8tlnp0005iap48q5qcc4q	\N	{"status": "FINALIZED"}	\N	\N	2026-05-29 03:23:42.736
cmpqcxvv6000nia4wxi2644cw	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmpp8tlnp0005iap48q5qcc4q	\N	{"status": "FINALIZED"}	\N	\N	2026-05-29 03:23:45.427
cmpqdmjp7001fia4wdqhcbtla	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 523, "y": 512, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 11, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 542, "y": 508, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 25, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 03:42:56.059
cmpqdmovg001hia4wcp8wb1j8	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 542, "y": 508, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 25, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 530, "y": 505, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 25, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 03:43:02.765
cmpqdocki001jia4wli0sjkjp	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 530, "y": 505, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 25, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 530, "y": 505, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "psaVisionMission", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 25, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 235, "y": 72, "id": "54570d4c-acfe-4838-acb6-95e45965c6ae", "key": "openingPrayer", "wrap": false, "label": "Opening Prayer", "isBold": false, "fontSize": 11, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 03:44:20.131
cmpqdpiso001via4wnd9iis9w	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmpp8tlnp0005iap48q5qcc4q	\N	{"status": "FINALIZED"}	\N	\N	2026-05-29 03:45:14.856
cmpqdqdfn002aia4wuk1zgpgt	cmplkm5x70000iaeg6ej70tgq	CREATE	ConvocationProgram	cmpqdqdfa001xia4wa2udfmxm	\N	{"id": "cmpqdqdfa001xia4wa2udfmxm", "notes": null, "status": "DRAFT", "groupId": "convocation_group_3", "createdAt": "2026-05-29T03:45:54.550Z", "printedAt": null, "updatedAt": "2026-05-29T03:45:54.550Z", "finalizedAt": null, "finalizedById": null, "generatedById": "cmplkm5x70000iaeg6ej70tgq", "convocationDate": "2026-06-07T16:00:00.000Z", "calendarActivityId": null}	\N	\N	2026-05-29 03:45:54.563
cmpqfkkw00001iaz8yf4zmz3e	cmplkm5x70000iaeg6ej70tgq	SET_DEFAULT	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	\N	{"isDefault": true}	\N	\N	2026-05-29 04:37:23.52
cmpqgmcri0003iaz8edyc8ife	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 530, "y": 505, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "psaVisionMission", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 25, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 235, "y": 72, "id": "54570d4c-acfe-4838-acb6-95e45965c6ae", "key": "openingPrayer", "wrap": false, "label": "Opening Prayer", "isBold": false, "fontSize": 11, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 530, "y": 505, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "psaVisionMission", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 25, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 235, "y": 72, "id": "54570d4c-acfe-4838-acb6-95e45965c6ae", "key": "openingPrayer", "wrap": false, "label": "Opening Prayer", "isBold": false, "fontSize": 11, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 05:06:45.918
cmpqgtskq0005iaz8revmb10y	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 530, "y": 505, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "psaVisionMission", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 25, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 235, "y": 72, "id": "54570d4c-acfe-4838-acb6-95e45965c6ae", "key": "openingPrayer", "wrap": false, "label": "Opening Prayer", "isBold": false, "fontSize": 11, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 541.4399999999999, "y": 500, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "psaVisionMission", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 29, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 235, "y": 72, "id": "54570d4c-acfe-4838-acb6-95e45965c6ae", "key": "openingPrayer", "wrap": false, "label": "Opening Prayer", "isBold": false, "fontSize": 11, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 05:12:33.002
cmpqh1pyz0007iaz87lm56w1g	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 541.4399999999999, "y": 500, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "psaVisionMission", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 29, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 235, "y": 72, "id": "54570d4c-acfe-4838-acb6-95e45965c6ae", "key": "openingPrayer", "wrap": false, "label": "Opening Prayer", "isBold": false, "fontSize": 11, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 541.4399999999999, "y": 500, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "psaVisionMission", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 29, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 05:18:42.875
cmpqh7an80009iaz8l4rdlb7h	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 541.4399999999999, "y": 500, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "psaVisionMission", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 29, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 541.4399999999999, "y": 502, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "psaVisionMission", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 29, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 05:23:02.949
cmpqhofji000biaz860ikpepz	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 541.4399999999999, "y": 502, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "psaVisionMission", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 29, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 503, "y": 501, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 29, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": false}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 05:36:22.446
cmpqjfi630001ia5sz4zh6luh	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 503, "y": 501, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 29, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": false}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 514.66, "y": 514, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 33, "maxWidth": 233.5600000000001, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": false}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 06:25:25.179
cmpqjhfdn0003ia5sp44fsyjt	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 514.66, "y": 514, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 33, "maxWidth": 233.5600000000001, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": false}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 514.66, "y": 514, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 33, "maxWidth": 233.5600000000001, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": false}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 06:26:54.875
cmpqkbg7y000hia5sjkvadl7m	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 06:50:15.646
cmpqjktbu0005ia5sjqkjdi5g	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 514.66, "y": 514, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 33, "maxWidth": 233.5600000000001, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": false}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 514.66, "y": 514, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 33, "maxWidth": 233.5600000000001, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": false}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 06:29:32.922
cmpqjoupb0007ia5skgu5lqjw	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 514.66, "y": 514, "id": "db996f36-aaa5-48d4-9957-e1f64adee75c", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 33, "maxWidth": 233.5600000000001, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": false}, {"x": 120, "y": 505, "id": "af81e9cc-ee37-4827-baad-5872475aafe7", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 24, "maxWidth": 180, "alignment": "center", "fontFamily": "Times Roman", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 538, "y": 529, "id": "17968a2c-ea81-427a-a74c-dbac96954f69", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": false, "fontSize": 15, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 72, "y": 72, "id": "ad8fa104-0909-43b7-81ce-fc8c11cc5216", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": false, "fontSize": 11, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 06:32:41.328
cmpqjq4m20009ia5spzbg1nh6	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 538, "y": 529, "id": "17968a2c-ea81-427a-a74c-dbac96954f69", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": false, "fontSize": 15, "maxWidth": 180, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 72, "y": 72, "id": "ad8fa104-0909-43b7-81ce-fc8c11cc5216", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": false, "fontSize": 11, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 513.9399999999999, "y": 519, "id": "17968a2c-ea81-427a-a74c-dbac96954f69", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 30, "maxWidth": 241, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 72, "y": 72, "id": "ad8fa104-0909-43b7-81ce-fc8c11cc5216", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": false, "fontSize": 11, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 06:33:40.826
cmpqjr71x000bia5s8gafseer	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"fields": [{"x": 513.9399999999999, "y": 519, "id": "17968a2c-ea81-427a-a74c-dbac96954f69", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 30, "maxWidth": 241, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}, {"x": 72, "y": 72, "id": "ad8fa104-0909-43b7-81ce-fc8c11cc5216", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": false, "fontSize": 11, "maxWidth": 180, "alignment": "left", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 513.9399999999999, "y": 519, "id": "17968a2c-ea81-427a-a74c-dbac96954f69", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 30, "maxWidth": 241, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 06:34:30.645
cmpqk9iav000fia5stm0az90c	cmplkm5x70000iaeg6ej70tgq	CREATE	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	\N	{"id": "cmpqk9iam000dia5sib2j3o3n", "name": "Convocation Program v2", "fileUrl": "/uploads/pdf-templates/1780037325008-Convocation_Program.pdf", "fieldMap": {"fields": [], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}, "fileName": "Convocation Program.pdf", "isActive": true, "createdAt": "2026-05-29T06:48:45.022Z", "isDefault": false, "pageCount": 2, "updatedAt": "2026-05-29T06:48:45.022Z", "createdById": "cmplkm5x70000iaeg6ej70tgq", "description": null, "templateFeature": "CONVOCATION_PROGRAM"}	\N	\N	2026-05-29 06:48:45.032
cmpqkgvef000jia5srlqbou45	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 06:54:28.599
cmpr0m7w60001iay0zh88ml4j	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-29 14:26:31.923
cmpr0mai50003iay0i10o6mf4	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-29 14:26:35.31
cmpr20nut0005iay0bzq60oen	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 318, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 15:05:45.413
cmpr26n390007iay0ektrcx9l	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 318, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 318, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 15:10:24.357
cmpr2anyj0009iay0zf5ayv53	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 318, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 15:13:32.107
cmpr32flr000biay0s3l05dsi	cmplkm5x70000iaeg6ej70tgq	SET_DEFAULT	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	\N	{"isDefault": true}	\N	\N	2026-05-29 15:35:07.647
cmpr3uqnu0001iar8ecwggnr3	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-29 15:57:08.346
cmproo3z3000ciar8hbn91g9n	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-30 01:39:50.944
cmprot6zp000giar8peq16cfj	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprot6zi000eiar893u9plbx	\N	{"id": "cmprot6zi000eiar893u9plbx", "name": "Milan L. Gutay", "role": "EMPLOYEE", "email": "m.gutay@psa.gov.ph", "section": "Statistical Operations", "isActive": true, "username": "m.gutay", "createdAt": "2026-05-30T01:43:48.126Z", "updatedAt": "2026-05-30T01:43:48.126Z", "employeeId": "PSA1043-010", "lastLoginAt": null, "personnelId": "cmpm7q17h003fiausimucssfj", "passwordHash": "$2b$12$MdRBQDft7a5fpEEG392k9uXluKeyqqWUX7MOFUrLMX9ZMIBQnTobm", "mustChangePassword": true}	\N	\N	2026-05-30 01:43:48.133
cmprotgk3000kiar80wyxo5aq	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprotgjx000iiar8nvk7aldv	\N	{"id": "cmprotgjx000iiar8nvk7aldv", "name": "Aaron Allen E. Cainglet", "role": "EMPLOYEE", "email": "a.cainglet@psa.gov.ph", "section": "Statistical Operations", "isActive": true, "username": "a.cainglet", "createdAt": "2026-05-30T01:44:00.525Z", "updatedAt": "2026-05-30T01:44:00.525Z", "employeeId": "PSA1043-012", "lastLoginAt": null, "personnelId": "cmpm7rduc003iiausmprulwf1", "passwordHash": "$2b$12$Q0MR5nZA6.oJFZbcCsuLYe8ASEeabwbNLqvtWIXVMEBxjgwvF9yZK", "mustChangePassword": true}	\N	\N	2026-05-30 01:44:00.531
cmprotqbn000oiar89ga6zj5t	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprotqbi000miar8oowhzmar	\N	{"id": "cmprotqbi000miar8oowhzmar", "name": "Adams Christopher P. Sios-e", "role": "EMPLOYEE", "email": "a.siose@psa.gov.ph", "section": "Statistical Operations", "isActive": true, "username": "a.siose", "createdAt": "2026-05-30T01:44:13.182Z", "updatedAt": "2026-05-30T01:44:13.182Z", "employeeId": "PSA1043-003", "lastLoginAt": null, "personnelId": "cmpm6z80v002viausbcqx3ozw", "passwordHash": "$2b$12$MAtg46.e5ClsarvHQ8U6hu.zSY5.zI7M4XuuLQ4bdvNnZIcbjOIBe", "mustChangePassword": true}	\N	\N	2026-05-30 01:44:13.187
cmprou6by000siar8wsg12fyd	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprou6bt000qiar8b0qy9g69	\N	{"id": "cmprou6bt000qiar8b0qy9g69", "name": "Brian Jay Sacala", "role": "ADMIN", "email": "b.sacala@psa.gov.ph", "section": "Statistical Operations", "isActive": true, "username": "b.sacala", "createdAt": "2026-05-30T01:44:33.929Z", "updatedAt": "2026-05-30T01:44:33.929Z", "employeeId": "PSA1043-020", "lastLoginAt": null, "personnelId": "cmpmaaekm0046iausrahtxbtp", "passwordHash": "$2b$12$AzUWkmXfl3mhPApJT.PbQure0GDYRAscAfcOuh9/lFYDSK.7MgW1i", "mustChangePassword": true}	\N	\N	2026-05-30 01:44:33.934
cmprouhzp000wiar8jabimp3h	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprouhzl000uiar82bggsy0u	\N	{"id": "cmprouhzl000uiar82bggsy0u", "name": "Catherine Mae G. Chin", "role": "EMPLOYEE", "email": null, "section": "Civil Registration and Vital Statistics", "isActive": true, "username": "c.chin", "createdAt": "2026-05-30T01:44:49.041Z", "updatedAt": "2026-05-30T01:44:49.041Z", "employeeId": "PSA1043-038", "lastLoginAt": null, "personnelId": "cmpmczbk0005wiausmycr3jbp", "passwordHash": "$2b$12$oxFPrwrQ8Uq0USJ0PK7Jqu7mYW1pmK2z02L1NsyZLoN3hw.njW/pG", "mustChangePassword": true}	\N	\N	2026-05-30 01:44:49.045
cmprous7h0010iar8binytg4a	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprous7a000yiar8nmv94emc	\N	{"id": "cmprous7a000yiar8nmv94emc", "name": "Cherry May C. Parajis", "role": "EMPLOYEE", "email": null, "section": "Civil Registration and Vital Statistics", "isActive": true, "username": "c.parajis", "createdAt": "2026-05-30T01:45:02.279Z", "updatedAt": "2026-05-30T01:45:02.279Z", "employeeId": "PSA1043-023", "lastLoginAt": null, "personnelId": "cmpmain42004fiaus2twkusb1", "passwordHash": "$2b$12$u5awBYQA78FUvC1iwhY3EOZG4fVnILXKepF6Kv/indy0hL13oZbHO", "mustChangePassword": true}	\N	\N	2026-05-30 01:45:02.285
cmprovhf40014iar8j1x341ij	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprovhem0012iar8l6oo5zi0	\N	{"id": "cmprovhem0012iar8l6oo5zi0", "name": "Christian Jen Labado", "role": "EMPLOYEE", "email": "c.labado.psa@gmail.com", "section": "Philippine Identification System", "isActive": true, "username": "c.labado", "createdAt": "2026-05-30T01:45:34.943Z", "updatedAt": "2026-05-30T01:45:34.943Z", "employeeId": "PSA1043-029", "lastLoginAt": null, "personnelId": "cmpmbbun40051iaus0ypzmgo0", "passwordHash": "$2b$12$dWZ6MsXtOdlXTH3/ZuLt7.6sm.la/5FFPNeFeDoU/7k53A4F6nUvq", "mustChangePassword": true}	\N	\N	2026-05-30 01:45:34.96
cmprovspc0018iar8mpd1myym	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprovsp70016iar8t0atnzdo	\N	{"id": "cmprovsp70016iar8t0atnzdo", "name": "Cindy B. Dumaloan", "role": "EMPLOYEE", "email": null, "section": "Civil Registration and Vital Statistics", "isActive": true, "username": "c.dumaloan", "createdAt": "2026-05-30T01:45:49.579Z", "updatedAt": "2026-05-30T01:45:49.579Z", "employeeId": "PSA1043-015", "lastLoginAt": null, "personnelId": "cmpm7wjyu003riaus32ihl37b", "passwordHash": "$2b$12$hqZeyN0I/evpnwmPrGuxG.X1C2aKnbPAGSTnHaIPaoOdGSgn4LTzq", "mustChangePassword": true}	\N	\N	2026-05-30 01:45:49.585
cmprow0tf001ciar8p07qg40s	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprow0tb001aiar8l2pxxy5s	\N	{"id": "cmprow0tb001aiar8l2pxxy5s", "name": "Clarissa L. Nico", "role": "EMPLOYEE", "email": "c.nico.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "username": "c.nico", "createdAt": "2026-05-30T01:46:00.095Z", "updatedAt": "2026-05-30T01:46:00.095Z", "employeeId": "PSA1043-037", "lastLoginAt": null, "personnelId": "cmpmcyll0005tiaus9udmpd06", "passwordHash": "$2b$12$buz0bAVrT.gCYeuP7TiKVuxKvIFyKeENcQtrtOFYXxPxNU3QJFrL.", "mustChangePassword": true}	\N	\N	2026-05-30 01:46:00.1
cmprowfaw001giar8n17bjk4s	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprowfas001eiar8lrsazwik	\N	{"id": "cmprowfas001eiar8lrsazwik", "name": "Deana Dell B. Pornia", "role": "EMPLOYEE", "email": "d.pornia@psa.gov.ph", "section": "Statistical Operations", "isActive": true, "username": "d.pornia", "createdAt": "2026-05-30T01:46:18.868Z", "updatedAt": "2026-05-30T01:46:18.868Z", "employeeId": "PSA1043-005", "lastLoginAt": null, "personnelId": "cmpm71afq0031iausuxhheoyf", "passwordHash": "$2b$12$51qnuratuhJ8boAv8riZde0VboQylFrNH4vXe1OZlFQQ6cuqSwY4W", "mustChangePassword": true}	\N	\N	2026-05-30 01:46:18.872
cmprowo9q001kiar8u037x36f	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprowo9l001iiar8cij3h5w5	\N	{"id": "cmprowo9l001iiar8cij3h5w5", "name": "Edwin D. Meñoza", "role": "EMPLOYEE", "email": "e.menoza.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "username": "e.menoza", "createdAt": "2026-05-30T01:46:30.489Z", "updatedAt": "2026-05-30T01:46:30.489Z", "employeeId": "PSA1043-036", "lastLoginAt": null, "personnelId": "cmpmcxxg5005qiausn9g2slk7", "passwordHash": "$2b$12$NoICfNexw7/vmoP/uQg7quyNbz92i96poqXr5l/65vy8aU9ydWweS", "mustChangePassword": true}	\N	\N	2026-05-30 01:46:30.495
cmprowub8001oiar8cikwoe10	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprowub5001miar89qh70ser	\N	{"id": "cmprowub5001miar89qh70ser", "name": "Glenda C. Bazar", "role": "EMPLOYEE", "email": "g.bazar@psa.gov.ph", "section": "Administrative and Accounting", "isActive": true, "username": "g.bazar", "createdAt": "2026-05-30T01:46:38.321Z", "updatedAt": "2026-05-30T01:46:38.321Z", "employeeId": "PSA1043-019", "lastLoginAt": null, "personnelId": "cmpma9o460043iausnsgkdz9b", "passwordHash": "$2b$12$rHvjBigngLhC738Ef8SLm.L8EROBHsrffvqfgbcRLlaElC1Tdvbui", "mustChangePassword": true}	\N	\N	2026-05-30 01:46:38.325
cmproy6yd001uiar805ajo3v8	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmproy6y8001siar8a50hg49k	\N	{"id": "cmproy6y8001siar8a50hg49k", "name": "Hector B. Paylangco", "role": "VIEWER", "email": null, "section": "Administrative and Accounting", "isActive": true, "username": "h.paylangco", "createdAt": "2026-05-30T01:47:41.360Z", "updatedAt": "2026-05-30T01:47:41.360Z", "employeeId": "PSA1043-027", "lastLoginAt": null, "personnelId": "cmpmamcwq004viaus5y4atq5q", "passwordHash": "$2b$12$ivNMAnhsKs4LxKRZqLbSeOK.uP8rWmjpAyG5fNqL30IH.v8GCA382", "mustChangePassword": true}	\N	\N	2026-05-30 01:47:41.365
cmproyjxh001yiar8ec0ad0um	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmproyjxc001wiar8nok429s7	\N	{"id": "cmproyjxc001wiar8nok429s7", "name": "Jemima P. Gutoc", "role": "EMPLOYEE", "email": "j.gutoc@psa.gov.pph", "section": "Administrative and Accounting", "isActive": true, "username": "j.gutoc", "createdAt": "2026-05-30T01:47:58.176Z", "updatedAt": "2026-05-30T01:47:58.176Z", "employeeId": "PSA1043-007", "lastLoginAt": null, "personnelId": "cmpm7nzmm0039iauss19l621g", "passwordHash": "$2b$12$Vk27E1lw6LDPnwS6s.DS8.FZl9Ej/GLrwLYa1A4FqngIvhzTzYCE6", "mustChangePassword": true}	\N	\N	2026-05-30 01:47:58.182
cmproyynq0022iar8m0yqbqet	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmproyynl0020iar8xeh4tvgk	\N	{"id": "cmproyynl0020iar8xeh4tvgk", "name": "Jerwin A. Asiñero", "role": "EMPLOYEE", "email": "j.asinero@psa.gov.ph", "section": "Statistical Operations", "isActive": true, "username": "j.asinero", "createdAt": "2026-05-30T01:48:17.265Z", "updatedAt": "2026-05-30T01:48:17.265Z", "employeeId": "PSA1043-002", "lastLoginAt": null, "personnelId": "cmpm6jzck002siausjij512h3", "passwordHash": "$2b$12$9fM/ovvO.9LQmrnQ1Y7O5OOykkHFYGyBNJw3NwiruWH0zGAce.wyq", "mustChangePassword": true}	\N	\N	2026-05-30 01:48:17.27
cmprozcnm0026iar8iy5fz3oc	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprozcnh0024iar82a7i93si	\N	{"id": "cmprozcnh0024iar82a7i93si", "name": "Jose Edgar D. Estrella", "role": "EMPLOYEE", "email": "j.estrella@psa.gov.ph", "section": "Administrative and Accounting", "isActive": true, "username": "j.estrella", "createdAt": "2026-05-30T01:48:35.405Z", "updatedAt": "2026-05-30T01:48:35.405Z", "employeeId": "PSA1043-009", "lastLoginAt": null, "personnelId": "cmpm7p9r4003ciausxxtm77m0", "passwordHash": "$2b$12$.IuCB3PDoC.0TukBhpEJ6enSR69KD1lFtHBdnC5KfN4aYgwUkOls6", "mustChangePassword": true}	\N	\N	2026-05-30 01:48:35.41
cmprozk5b002aiar8ffk7y5vt	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprozk560028iar8p2tu3at3	\N	{"id": "cmprozk560028iar8p2tu3at3", "name": "Joselindo C. Udal", "role": "EMPLOYEE", "email": null, "section": "Philippine Identification System", "isActive": true, "username": "j.udal", "createdAt": "2026-05-30T01:48:45.114Z", "updatedAt": "2026-05-30T01:48:45.114Z", "employeeId": "PSA1043-026", "lastLoginAt": null, "personnelId": "cmpmalk2l004qiausp3pm1z6f", "passwordHash": "$2b$12$Z0PrjPA2WeR2X4ntHf1BMuP0MudoQh3ik7D/A61BEX1MXIKTkj1he", "mustChangePassword": true}	\N	\N	2026-05-30 01:48:45.119
cmproznja002ciar84esdi9i4	cmplkm5x70000iaeg6ej70tgq	UPDATE_USER	User	cmprozk560028iar8p2tu3at3	{"id": "cmprozk560028iar8p2tu3at3", "name": "Joselindo C. Udal", "role": "EMPLOYEE", "email": null, "section": "Philippine Identification System", "isActive": true, "username": "j.udal", "createdAt": "2026-05-30T01:48:45.114Z", "updatedAt": "2026-05-30T01:48:45.114Z", "employeeId": "PSA1043-026", "lastLoginAt": null, "personnelId": "cmpmalk2l004qiausp3pm1z6f", "passwordHash": "$2b$12$Z0PrjPA2WeR2X4ntHf1BMuP0MudoQh3ik7D/A61BEX1MXIKTkj1he", "mustChangePassword": true}	{"id": "cmprozk560028iar8p2tu3at3", "name": "Joselindo C. Udal", "role": "VIEWER", "email": null, "section": "Philippine Identification System", "isActive": true, "username": "j.udal", "createdAt": "2026-05-30T01:48:45.114Z", "updatedAt": "2026-05-30T01:48:49.504Z", "employeeId": "PSA1043-026", "lastLoginAt": null, "personnelId": "cmpmalk2l004qiausp3pm1z6f", "passwordHash": "$2b$12$Z0PrjPA2WeR2X4ntHf1BMuP0MudoQh3ik7D/A61BEX1MXIKTkj1he", "mustChangePassword": true}	\N	\N	2026-05-30 01:48:49.51
cmprozzpa002giar89ah69494	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprozzp6002eiar851ke8jhc	\N	{"id": "cmprozzp6002eiar851ke8jhc", "name": "Kathleen Marie P. Medel", "role": "EMPLOYEE", "email": "k.medel.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "username": "k.medel", "createdAt": "2026-05-30T01:49:05.274Z", "updatedAt": "2026-05-30T01:49:05.274Z", "employeeId": "PSA1043-025", "lastLoginAt": null, "personnelId": "cmpmakc8i004liaus6oylw747", "passwordHash": "$2b$12$IvcKlFccwOYF9.05xmnlEOztKcrjxpmIsg4lcXGPZujRVsEMKnXUW", "mustChangePassword": true}	\N	\N	2026-05-30 01:49:05.279
cmprp1pt9002kiar8fw09rltt	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp1pt3002iiar82g2ry8sv	\N	{"id": "cmprp1pt3002iiar82g2ry8sv", "name": "Kimberly F. Esmeralda", "role": "EMPLOYEE", "email": null, "section": "Civil Registration and Vital Statistics", "isActive": true, "username": "k.esmeralda", "createdAt": "2026-05-30T01:50:25.767Z", "updatedAt": "2026-05-30T01:50:25.767Z", "employeeId": "PSA1043-022", "lastLoginAt": null, "personnelId": "cmpmackhz004ciausks7jgn0o", "passwordHash": "$2b$12$pL0NTuUlQV6KqstPw/fHpOUpHtM9dW4gS91A5KACPfEbcFlQhwzwW", "mustChangePassword": true}	\N	\N	2026-05-30 01:50:25.773
cmprp1zmw002oiar8r8vv1h3b	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp1zmr002miar8epjep3s0	\N	{"id": "cmprp1zmr002miar8epjep3s0", "name": "Lee Charge S. Cailing", "role": "EMPLOYEE", "email": "l.cailing@psa.gov.ph", "section": "Statistical Operations", "isActive": true, "username": "l.cailing", "createdAt": "2026-05-30T01:50:38.499Z", "updatedAt": "2026-05-30T01:50:38.499Z", "employeeId": "PSA1043-004", "lastLoginAt": null, "personnelId": "cmpm70pwb002yiaus2m2fx6w0", "passwordHash": "$2b$12$VwdYgRjxrPGUrUnl.7Ckse3DdVv2piOQxioETN.iWRyiAnGL8ev7i", "mustChangePassword": true}	\N	\N	2026-05-30 01:50:38.504
cmprp29f2002siar8jpkj3nlh	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp29ex002qiar8a5ddgo68	\N	{"id": "cmprp29ex002qiar8a5ddgo68", "name": "Maria Guada F. Dosdos", "role": "EMPLOYEE", "email": "m.flores@psa.gov.ph", "section": "Administrative and Accounting", "isActive": true, "username": "m.dosdos", "createdAt": "2026-05-30T01:50:51.177Z", "updatedAt": "2026-05-30T01:50:51.177Z", "employeeId": "PSA1043-017", "lastLoginAt": null, "personnelId": "cmpm7z8kc003xiauswx84u6ek", "passwordHash": "$2b$12$tnK0GaEG.C.9Nma82e1T4O/SbhLa9pmRpPvLnTjRLJEX594/EYG/C", "mustChangePassword": true}	\N	\N	2026-05-30 01:50:51.182
cmprp2gyk002wiar8vhzde8y1	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp2gyg002uiar8yfy3qfrc	\N	{"id": "cmprp2gyg002uiar8yfy3qfrc", "name": "Maria Liza M. Bigornia", "role": "SUPERVISOR", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "isActive": true, "username": "m.bigornia", "createdAt": "2026-05-30T01:51:00.952Z", "updatedAt": "2026-05-30T01:51:00.952Z", "employeeId": "PSA1043-001", "lastLoginAt": null, "personnelId": "cmpm6ioph002niausbtnw8zo3", "passwordHash": "$2b$12$nFS2JugWwRTf4/tUVvT8BecKjd0/Jfhw1qotnG5LnUG1alfxzw3k2", "mustChangePassword": true}	\N	\N	2026-05-30 01:51:00.957
cmprp2ted0030iar8shsb9aru	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp2te8002yiar8ojq52zwk	\N	{"id": "cmprp2te8002yiar8ojq52zwk", "name": "Marivic R. Escobido", "role": "EMPLOYEE", "email": "m.escobido@psa.gov.ph", "section": "Civil Registration and Vital Statistics", "isActive": true, "username": "m.escobido", "createdAt": "2026-05-30T01:51:17.072Z", "updatedAt": "2026-05-30T01:51:17.072Z", "employeeId": "PSA1043-006", "lastLoginAt": null, "personnelId": "cmpm7nh3s0036iausxm44cu9t", "passwordHash": "$2b$12$37m6N2sJFc1AmxQvE3wa1.bmG8Zw1k3oEvhpYEQ0djeZjbr5Xp/u6", "mustChangePassword": true}	\N	\N	2026-05-30 01:51:17.077
cmprp32yu0034iar8o7971oa3	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp32yp0032iar83wks68fy	\N	{"id": "cmprp32yp0032iar83wks68fy", "name": "Marlon T. Galindo", "role": "EMPLOYEE", "email": "m.galindo@psa.gov.ph", "section": "Statistical Operations", "isActive": true, "username": "m.galindo", "createdAt": "2026-05-30T01:51:29.473Z", "updatedAt": "2026-05-30T01:51:29.473Z", "employeeId": "PSA1043-013", "lastLoginAt": null, "personnelId": "cmpm7s7j8003liauswjjxk8ex", "passwordHash": "$2b$12$MQRXQqST.U19qy8Z31CcHu35xET/O4.IoC0AiLCXlp.XgMU0nraY2", "mustChangePassword": true}	\N	\N	2026-05-30 01:51:29.478
cmprp3gzb0038iar8puqiotzc	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp3gz70036iar80eg0zh3i	\N	{"id": "cmprp3gz70036iar80eg0zh3i", "name": "May T. Dublin", "role": "EMPLOYEE", "email": "m.dublin@psa.gov.ph", "section": "Civil Registration and Vital Statistics", "isActive": true, "username": "m.dublin", "createdAt": "2026-05-30T01:51:47.635Z", "updatedAt": "2026-05-30T01:51:47.635Z", "employeeId": "PSA1043-016", "lastLoginAt": null, "personnelId": "cmpm7y2d5003uiaushuvnjj0w", "passwordHash": "$2b$12$ib/hVrMycG/82HspHbeBLeCAqR8jUOjqJtCkoPx2V..cEvuATsvl6", "mustChangePassword": true}	\N	\N	2026-05-30 01:51:47.64
cmprp40vs003ciar8yx41vxj2	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp40vo003aiar8forj6vpj	\N	{"id": "cmprp40vo003aiar8forj6vpj", "name": "Merlie T. Montera", "role": "EMPLOYEE", "email": "m.montera@psa.gov.ph", "section": "Statistical Operations", "isActive": true, "username": "m.montera", "createdAt": "2026-05-30T01:52:13.428Z", "updatedAt": "2026-05-30T01:52:13.428Z", "employeeId": "PSA1043-014", "lastLoginAt": null, "personnelId": "cmpm7sv69003oiausjksd398m", "passwordHash": "$2b$12$l5OsWkBBFXPDev28F0vDVuwXeeGt0WDRjtyWXYPPy0laEbEJtOBJW", "mustChangePassword": true}	\N	\N	2026-05-30 01:52:13.433
cmprp48m6003giar83l0bdfsi	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp48m1003eiar8xwdzkna0	\N	{"id": "cmprp48m1003eiar8xwdzkna0", "name": "Paula P. Dedumo", "role": "EMPLOYEE", "email": "p.dedumo.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "username": "p.dedumo", "createdAt": "2026-05-30T01:52:23.449Z", "updatedAt": "2026-05-30T01:52:23.449Z", "employeeId": "PSA1043-035", "lastLoginAt": null, "personnelId": "cmpmcwkjj005niausxhpwr0rq", "passwordHash": "$2b$12$F3JQ17v2VbbR7p252o9./.lFcTv4x5If8o0Kkgqbgy1NPbxZgg.cO", "mustChangePassword": true}	\N	\N	2026-05-30 01:52:23.454
cmprp4ixb003kiar8s0gjpqo0	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp4ix5003iiar8v8fxuweo	\N	{"id": "cmprp4ix5003iiar8v8fxuweo", "name": "Queenie Marie B. Casiño", "role": "EMPLOYEE", "email": "q.casino.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "username": "q.casino", "createdAt": "2026-05-30T01:52:36.809Z", "updatedAt": "2026-05-30T01:52:36.809Z", "employeeId": "PSA1043-032", "lastLoginAt": null, "personnelId": "cmpmctto9005eiaus7jv5w8sw", "passwordHash": "$2b$12$xrP0leYUwoRBDeC3bm.5GO2fdTtEJaVBbaB1UCPx8AxTXm6/jZ99W", "mustChangePassword": true}	\N	\N	2026-05-30 01:52:36.816
cmprp531n003oiar8avs11w1l	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp531i003miar8ydi9ceuc	\N	{"id": "cmprp531i003miar8ydi9ceuc", "name": "Rodelyn Navarosa", "role": "EMPLOYEE", "email": "r.navarosa.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "username": "r.navarosa", "createdAt": "2026-05-30T01:53:02.887Z", "updatedAt": "2026-05-30T01:53:02.887Z", "employeeId": "PSA1043-031", "lastLoginAt": null, "personnelId": "cmpmcsydy005biaus8mz8wrn4", "passwordHash": "$2b$12$IfYuEpKl0eXSNSsqmXQHR.8nsBE5PpVCFOLJ1UptbzfwWaMdjUKBe", "mustChangePassword": true}	\N	\N	2026-05-30 01:53:02.891
cmprp5d5q003siar8k8lgsz19	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp5d5m003qiar8ufiurlvm	\N	{"id": "cmprp5d5m003qiar8ufiurlvm", "name": "Ronel L. Llamera", "role": "EMPLOYEE", "email": "r.llamera.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "username": "r.llamera", "createdAt": "2026-05-30T01:53:15.994Z", "updatedAt": "2026-05-30T01:53:15.994Z", "employeeId": "PSA1043-034", "lastLoginAt": null, "personnelId": "cmpmcv3uk005kiausndde2tr6", "passwordHash": "$2b$12$jGK.tfbcfIFYKUmtb6ZEluTx6H9UD8cBx1HFKm1kpxdv2xwlv0SM6", "mustChangePassword": true}	\N	\N	2026-05-30 01:53:15.998
cmprp5k9z003wiar82oxj7fkf	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp5k9u003uiar8cjpe7aec	\N	{"id": "cmprp5k9u003uiar8cjpe7aec", "name": "Sheila May D. Regular", "role": "EMPLOYEE", "email": "s.regular.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "username": "s.regular", "createdAt": "2026-05-30T01:53:25.219Z", "updatedAt": "2026-05-30T01:53:25.219Z", "employeeId": "PSA1043-039", "lastLoginAt": null, "personnelId": "cmpmd0y8g005ziausnc38ns1g", "passwordHash": "$2b$12$b/S1UHjOqFNSAuWJG1znVOV868gh5mUnR6XD02OwAuXjr0wMylb82", "mustChangePassword": true}	\N	\N	2026-05-30 01:53:25.223
cmprp5sar0040iar8pxih9htr	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp5sal003yiar8kj0bc755	\N	{"id": "cmprp5sal003yiar8kj0bc755", "name": "Sheila P. Degala", "role": "EMPLOYEE", "email": "s.degala.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "username": "s.degala", "createdAt": "2026-05-30T01:53:35.613Z", "updatedAt": "2026-05-30T01:53:35.613Z", "employeeId": "PSA1043-033", "lastLoginAt": null, "personnelId": "cmpmcug27005hiauszp8pd7lt", "passwordHash": "$2b$12$odTqXBAKkeWXkyFmpsqkzeQUXanB6UPzwOo2tyLar0PeW6E9/qNqC", "mustChangePassword": true}	\N	\N	2026-05-30 01:53:35.619
cmprp60ag0044iar8b25nxw44	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp60ad0042iar8ugzse0q9	\N	{"id": "cmprp60ad0042iar8ugzse0q9", "name": "Vevien P. Baculio", "role": "EMPLOYEE", "email": "v.baculio@psa.gov.ph", "section": "Administrative and Accounting", "isActive": true, "username": "v.baculio", "createdAt": "2026-05-30T01:53:45.973Z", "updatedAt": "2026-05-30T01:53:45.973Z", "employeeId": "PSA1043-018", "lastLoginAt": null, "personnelId": "cmpm9wtav0040iaus5stdmg52", "passwordHash": "$2b$12$g.WeaYOd7wBqnscDJQygqOUuEa6leJujsOh3Q.xc0EtbNFDcZbCf2", "mustChangePassword": true}	\N	\N	2026-05-30 01:53:45.976
cmprp6lug0048iar8v4n6p5mb	cmplkm5x70000iaeg6ej70tgq	CREATE_USER	User	cmprp6lub0046iar82h4r5fql	\N	{"id": "cmprp6lub0046iar82h4r5fql", "name": "Wed Micole B. Quilang", "role": "EMPLOYEE", "email": "w.quilang.psa@gmail.com", "section": "Civil Registration and Vital Statistics", "isActive": true, "username": "w.quilang", "createdAt": "2026-05-30T01:54:13.907Z", "updatedAt": "2026-05-30T01:54:13.907Z", "employeeId": "PSA1043-024", "lastLoginAt": null, "personnelId": "cmpmajetn004iiaus2vel52gz", "passwordHash": "$2b$12$QXE8hRHTvle9FWbDrXmxhut/ceKsGMyd61acxsq.Qd20wjKxGuDSG", "mustChangePassword": true}	\N	\N	2026-05-30 01:54:13.912
cmprpgqea004aiar8pn1je2dg	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 518, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 521, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:02:06.37
cmprpif9m004ciar8fibby1br	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 521, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 521, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 125, "y": 525, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:03:25.259
cmprpl90h004eiar83fi34naz	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 521, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 125, "y": 525, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 521, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 125, "y": 525, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:05:37.121
cmprq4tky004giar8907mo95f	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 521, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 241, "y": 118, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 196, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 242, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 300, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 355, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 391, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 125, "y": 525, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 521, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 100, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 174, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 226, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 286, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 335, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 371, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 505, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:20:50.242
cmprq54x6004iiar84jdfm9wu	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 521, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 100, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 174, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 226, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 286, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 335, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 371, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 505, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 513, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 100, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 174, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 226, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 286, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 335, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 371, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 505, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:21:04.938
cmprq55l4004kiar8zz3uklju	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 513, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 100, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 174, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 226, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 286, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 335, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 371, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 505, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 513, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 100, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 174, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 226, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 286, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 335, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 371, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 505, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:21:05.8
cmprq6sh8004miar8w3fxum2r	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 513, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 100, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 174, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 226, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 286, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 335, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 371, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 505, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 100, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 174, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 226, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 286, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 335, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 371, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 505, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:22:22.124
cmprq6zmi004oiar8g8atkhy7	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 100, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 174, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 226, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 286, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 335, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 371, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 505, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 102, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 176, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 228, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 288, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 337, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 373, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 507, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:22:31.386
cmprq707t004qiar887tfeucj	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 102, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 176, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 228, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 288, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 337, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 373, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 507, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 102, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 176, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 228, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 288, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 337, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 373, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 507, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:22:32.153
cmprqa1q7004siar857d5dqwn	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 237, "y": 102, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 176, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 16, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 228, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 288, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 337, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 241, "y": 373, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 507, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 236, "y": 106, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 223, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 273, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 383, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 509, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:24:54.078
cmprqa363004uiar8zyv930wp	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 236, "y": 106, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 223, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 273, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 383, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 509, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 236, "y": 106, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 223, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 273, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 383, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 509, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:24:55.948
cmprqc4hj004wiar8rb5qrjcl	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 236, "y": 106, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 223, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 273, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 383, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 509, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 236, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 223, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 273, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 337, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 381, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:26:30.967
cmprqc5hi004yiar8qqb1aa7f	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 236, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 223, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 273, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 337, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 381, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 236, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 223, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 273, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 337, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 381, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:26:32.262
cmprqds430050iar8m0kf7c4j	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 236, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 223, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 273, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 337, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 236, "y": 381, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 121, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 123, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:27:48.243
cmprqdsp00052iar8nyjr14in	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 123, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 123, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:27:48.997
cmprqfe890058iar8kltoz2wa	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:29:03.561
cmprqdtpa0054iar81741ital	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 123, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 123, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:27:50.302
cmprqfdp60056iar8sfiawpof	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 123, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-05-30 02:29:02.874
cmprrxq3m005aiar8m9e6wko6	cmplkm5x70000iaeg6ej70tgq	DELETE	PdfTemplate	cmpqbr4rd0001iabw1uigllqf	{"id": "cmpqbr4rd0001iabw1uigllqf", "name": "Flag Ceremony Program", "fileUrl": "/uploads/pdf-templates/1780023030727-Convocation_Program.pdf", "fieldMap": {"fields": [{"x": 513.9399999999999, "y": 519, "id": "17968a2c-ea81-427a-a74c-dbac96954f69", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 30, "maxWidth": 241, "alignment": "center", "fontFamily": "Helvetica", "pageNumber": 1, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}, "fileName": "Convocation Program.pdf", "isActive": true, "createdAt": "2026-05-29T02:50:30.745Z", "isDefault": false, "pageCount": 2, "updatedAt": "2026-05-29T15:35:07.636Z", "createdById": "cmplkm5x70000iaeg6ej70tgq", "description": null, "templateFeature": "CONVOCATION_PROGRAM"}	null	\N	\N	2026-05-30 03:11:18.37
cmpse727w0001iax09csrm0lf	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-30 13:34:25.532
cmpsnyb450001iai8e8bn7ywb	cmpp3gnhz0007iafkfwlwufi4	LOGIN	User	cmpp3gnhz0007iafkfwlwufi4	\N	\N	\N	\N	2026-05-30 18:07:33.317
cmpsrf1ix0001ialoqt6cqu23	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmcmiud0058iaustuwfw2sp	{"id": "cmpmcmiud0058iaustuwfw2sp", "slug": "angel-marie-guillena", "email": null, "section": "Administrative and Accounting", "fullName": "Angel Marie Guillena", "isActive": true, "photoUrl": null, "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:03:50.629Z", "updatedAt": "2026-05-26T08:03:50.629Z", "employeeNo": "PSA1043-030", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmcmiud0058iaustuwfw2sp", "slug": "angel-marie-guillena", "email": "a.guillena.psa@gmail.com", "section": "Administrative and Accounting", "fullName": "Angel Marie Guillena", "isActive": true, "photoUrl": null, "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:03:50.629Z", "updatedAt": "2026-05-30T19:44:32.878Z", "employeeNo": "PSA1043-030", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:44:32.889
cmpsrfnok0003ialorawg4bjo	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm6ioph002niausbtnw8zo3	{"id": "cmpm6ioph002niausbtnw8zo3", "slug": "maria-liza-m-bigornia", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "fullName": "Maria Liza M. Bigornia", "isActive": true, "photoUrl": null, "position": "SG 24 - Chief Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:12:53.909Z", "updatedAt": "2026-05-26T05:13:08.421Z", "employeeNo": "PSA1043-001", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm6ioph002niausbtnw8zo3", "slug": "maria-liza-m-bigornia", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "fullName": "Maria Liza M. Bigornia", "isActive": true, "photoUrl": "/uploads/personnel/1780170301588-849.jpg", "position": "SG 24 - Chief Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:12:53.909Z", "updatedAt": "2026-05-30T19:45:01.598Z", "employeeNo": "PSA1043-001", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:45:01.604
cmpsrgamn0005ialo6ag5wa9t	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm6ioph002niausbtnw8zo3	{"id": "cmpm6ioph002niausbtnw8zo3", "slug": "maria-liza-m-bigornia", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "fullName": "Maria Liza M. Bigornia", "isActive": true, "photoUrl": "/uploads/personnel/1780170301588-849.jpg", "position": "SG 24 - Chief Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:12:53.909Z", "updatedAt": "2026-05-30T19:45:01.598Z", "employeeNo": "PSA1043-001", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm6ioph002niausbtnw8zo3", "slug": "maria-liza-m-bigornia", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "fullName": "Maria Liza M. Bigornia", "isActive": true, "photoUrl": "/uploads/personnel/1780170331324-652.jpg", "position": "SG 24 - Chief Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:12:53.909Z", "updatedAt": "2026-05-30T19:45:31.334Z", "employeeNo": "PSA1043-001", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:45:31.343
cmpsrhxh40007ialoee9kbitc	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm6ioph002niausbtnw8zo3	{"id": "cmpm6ioph002niausbtnw8zo3", "slug": "maria-liza-m-bigornia", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "fullName": "Maria Liza M. Bigornia", "isActive": true, "photoUrl": "/uploads/personnel/1780170331324-652.jpg", "position": "SG 24 - Chief Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:12:53.909Z", "updatedAt": "2026-05-30T19:45:31.334Z", "employeeNo": "PSA1043-001", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm6ioph002niausbtnw8zo3", "slug": "maria-liza-m-bigornia", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "fullName": "Maria Liza M. Bigornia", "isActive": true, "photoUrl": "/uploads/personnel/1780170407589-730.jpg", "position": "SG 24 - Chief Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:12:53.909Z", "updatedAt": "2026-05-30T19:46:47.604Z", "employeeNo": "PSA1043-001", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:46:47.608
cmpsrkr1s0009ialo0os158bx	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm6ioph002niausbtnw8zo3	{"id": "cmpm6ioph002niausbtnw8zo3", "slug": "maria-liza-m-bigornia", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "fullName": "Maria Liza M. Bigornia", "isActive": true, "photoUrl": "/uploads/personnel/1780170407589-730.jpg", "position": "SG 24 - Chief Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:12:53.909Z", "updatedAt": "2026-05-30T19:46:47.604Z", "employeeNo": "PSA1043-001", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm6ioph002niausbtnw8zo3", "slug": "maria-liza-m-bigornia", "email": "l.bigornia@psa.gov.ph", "section": "Head of Office", "fullName": "Maria Liza M. Bigornia", "isActive": true, "photoUrl": "/uploads/personnel/1780170539232-396.webp", "position": "SG 24 - Chief Statistical Specialist", "contactNo": null, "createdAt": "2026-05-26T05:12:53.909Z", "updatedAt": "2026-05-30T19:48:59.241Z", "employeeNo": "PSA1043-001", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:48:59.248
cmpsrlnmb000bialo5zk48qn9	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmcmiud0058iaustuwfw2sp	{"id": "cmpmcmiud0058iaustuwfw2sp", "slug": "angel-marie-guillena", "email": "a.guillena.psa@gmail.com", "section": "Administrative and Accounting", "fullName": "Angel Marie Guillena", "isActive": true, "photoUrl": null, "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:03:50.629Z", "updatedAt": "2026-05-30T19:44:32.878Z", "employeeNo": "PSA1043-030", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmcmiud0058iaustuwfw2sp", "slug": "angel-marie-guillena", "email": "a.guillena.psa@gmail.com", "section": "Administrative and Accounting", "fullName": "Angel Marie Guillena", "isActive": true, "photoUrl": "/uploads/personnel/1780170581446-215.webp", "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:03:50.629Z", "updatedAt": "2026-05-30T19:49:41.454Z", "employeeNo": "PSA1043-030", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:49:41.46
cmpsrmsfh000dialo92rtxwg3	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm7nzmm0039iauss19l621g	{"id": "cmpm7nzmm0039iauss19l621g", "slug": "jemima-p-gutoc", "email": "j.gutoc@psa.gov.pph", "section": "Administrative and Accounting", "fullName": "Jemima P. Gutoc", "isActive": true, "photoUrl": null, "position": "SG 12 - Accountant I", "contactNo": null, "createdAt": "2026-05-26T05:45:00.958Z", "updatedAt": "2026-05-26T05:45:00.958Z", "employeeNo": "PSA1043-007", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm7nzmm0039iauss19l621g", "slug": "jemima-p-gutoc", "email": "j.gutoc@psa.gov.pph", "section": "Administrative and Accounting", "fullName": "Jemima P. Gutoc", "isActive": true, "photoUrl": "/uploads/personnel/1780170634336-856.webp", "position": "SG 12 - Accountant I", "contactNo": null, "createdAt": "2026-05-26T05:45:00.958Z", "updatedAt": "2026-05-30T19:50:34.345Z", "employeeNo": "PSA1043-007", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:50:34.35
cmpsrnuio000fialoviqk104d	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm7z8kc003xiauswx84u6ek	{"id": "cmpm7z8kc003xiauswx84u6ek", "slug": "maria-guada-f-dosdos", "email": "m.flores@psa.gov.ph", "section": "Administrative and Accounting", "fullName": "Maria Guada F. Dosdos", "isActive": true, "photoUrl": null, "position": "SG 9 - Administrative Assistant III", "contactNo": null, "createdAt": "2026-05-26T05:53:45.756Z", "updatedAt": "2026-05-26T05:53:45.756Z", "employeeNo": "PSA1043-017", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm7z8kc003xiauswx84u6ek", "slug": "maria-guada-f-dosdos", "email": "m.flores@psa.gov.ph", "section": "Administrative and Accounting", "fullName": "Maria Guada F. Dosdos", "isActive": true, "photoUrl": "/uploads/personnel/1780170683689-900.webp", "position": "SG 9 - Administrative Assistant III", "contactNo": null, "createdAt": "2026-05-26T05:53:45.756Z", "updatedAt": "2026-05-30T19:51:23.706Z", "employeeNo": "PSA1043-017", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:51:23.712
cmpsrosif000hialolz4wvnmh	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm9wtav0040iaus5stdmg52	{"id": "cmpm9wtav0040iaus5stdmg52", "slug": "vevien-p-baculio", "email": "v.baculio@psa.gov.ph", "section": "Administrative and Accounting", "fullName": "Vevien P. Baculio", "isActive": true, "photoUrl": null, "position": "SG 6 - Administrative Aide VI", "contactNo": null, "createdAt": "2026-05-26T06:47:51.895Z", "updatedAt": "2026-05-26T06:47:51.895Z", "employeeNo": "PSA1043-018", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm9wtav0040iaus5stdmg52", "slug": "vevien-p-baculio", "email": "v.baculio@psa.gov.ph", "section": "Administrative and Accounting", "fullName": "Vevien P. Baculio", "isActive": true, "photoUrl": "/uploads/personnel/1780170727753-365.webp", "position": "SG 6 - Administrative Aide VI", "contactNo": null, "createdAt": "2026-05-26T06:47:51.895Z", "updatedAt": "2026-05-30T19:52:07.762Z", "employeeNo": "PSA1043-018", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:52:07.767
cmpsrpofj000jialo0nrvj7cl	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmczbk0005wiausmycr3jbp	{"id": "cmpmczbk0005wiausmycr3jbp", "slug": "catherine-mae-g-chin", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Catherine Mae G. Chin", "isActive": true, "photoUrl": null, "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T08:13:47.712Z", "updatedAt": "2026-05-26T08:13:47.712Z", "employeeNo": "PSA1043-038", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmczbk0005wiausmycr3jbp", "slug": "catherine-mae-g-chin", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Catherine Mae G. Chin", "isActive": true, "photoUrl": "/uploads/personnel/1780170769121-894.webp", "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T08:13:47.712Z", "updatedAt": "2026-05-30T19:52:49.130Z", "employeeNo": "PSA1043-038", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:52:49.135
cmpsrqnw8000lialofv8n9d6f	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmain42004fiaus2twkusb1	{"id": "cmpmain42004fiaus2twkusb1", "slug": "cherry-may-c-parajis", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cherry May C. Parajis", "isActive": true, "photoUrl": null, "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T07:04:50.306Z", "updatedAt": "2026-05-26T07:59:47.085Z", "employeeNo": "PSA1043-023", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmain42004fiaus2twkusb1", "slug": "cherry-may-c-parajis", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cherry May C. Parajis", "isActive": true, "photoUrl": "/uploads/personnel/1780170815083-760.webp", "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T07:04:50.306Z", "updatedAt": "2026-05-30T19:53:35.091Z", "employeeNo": "PSA1043-023", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:53:35.096
cmpsrqyqq000nialo1v6dbnnx	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmain42004fiaus2twkusb1	{"id": "cmpmain42004fiaus2twkusb1", "slug": "cherry-may-c-parajis", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cherry May C. Parajis", "isActive": true, "photoUrl": "/uploads/personnel/1780170815083-760.webp", "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T07:04:50.306Z", "updatedAt": "2026-05-30T19:53:35.091Z", "employeeNo": "PSA1043-023", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmain42004fiaus2twkusb1", "slug": "cherry-may-c-parajis", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cherry May C. Parajis", "isActive": true, "photoUrl": "/uploads/personnel/1780170815083-760.webp", "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T07:04:50.306Z", "updatedAt": "2026-05-30T19:53:49.148Z", "employeeNo": "PSA1043-023", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:53:49.154
cmpsrrhmw000pialonvosz653	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmain42004fiaus2twkusb1	{"id": "cmpmain42004fiaus2twkusb1", "slug": "cherry-may-c-parajis", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cherry May C. Parajis", "isActive": true, "photoUrl": "/uploads/personnel/1780170815083-760.webp", "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T07:04:50.306Z", "updatedAt": "2026-05-30T19:53:49.148Z", "employeeNo": "PSA1043-023", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmain42004fiaus2twkusb1", "slug": "cherry-may-c-parajis", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cherry May C. Parajis", "isActive": true, "photoUrl": "/uploads/personnel/1780170853627-344.webp", "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T07:04:50.306Z", "updatedAt": "2026-05-30T19:54:13.635Z", "employeeNo": "PSA1043-023", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:54:13.64
cmpsrs8vh000rialo7wbbmwyh	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm7wjyu003riaus32ihl37b	{"id": "cmpm7wjyu003riaus32ihl37b", "slug": "cindy-b-dumaloan", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cindy B. Dumaloan", "isActive": true, "photoUrl": null, "position": "SG 10 - Registration Officer I", "contactNo": null, "createdAt": "2026-05-26T05:51:40.567Z", "updatedAt": "2026-05-26T05:51:40.567Z", "employeeNo": "PSA1043-015", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm7wjyu003riaus32ihl37b", "slug": "cindy-b-dumaloan", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cindy B. Dumaloan", "isActive": true, "photoUrl": "/uploads/personnel/1780170888926-603.webp", "position": "SG 10 - Registration Officer I", "contactNo": null, "createdAt": "2026-05-26T05:51:40.567Z", "updatedAt": "2026-05-30T19:54:48.935Z", "employeeNo": "PSA1043-015", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:54:48.941
cmpsrtmaj000tialonpx4ng7p	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmackhz004ciausks7jgn0o	{"id": "cmpmackhz004ciausks7jgn0o", "slug": "kimberly-f-esmeralda", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Kimberly F. Esmeralda", "isActive": true, "photoUrl": null, "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T07:00:06.983Z", "updatedAt": "2026-05-26T07:59:38.890Z", "employeeNo": "PSA1043-022", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmackhz004ciausks7jgn0o", "slug": "kimberly-f-esmeralda", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Kimberly F. Esmeralda", "isActive": true, "photoUrl": "/uploads/personnel/1780170952969-5.webp", "position": "Field Office Personnel***", "contactNo": null, "createdAt": "2026-05-26T07:00:06.983Z", "updatedAt": "2026-05-30T19:55:52.981Z", "employeeNo": "PSA1043-022", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:55:52.987
cmpsrueij000vialocyulxfwt	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm7nh3s0036iausxm44cu9t	{"id": "cmpm7nh3s0036iausxm44cu9t", "slug": "marivic-r-escobido", "email": "m.escobido@psa.gov.ph", "section": "Civil Registration and Vital Statistics", "fullName": "Marivic R. Escobido", "isActive": true, "photoUrl": null, "position": "SG 14 - Registration Officer II", "contactNo": null, "createdAt": "2026-05-26T05:44:36.953Z", "updatedAt": "2026-05-26T05:44:36.953Z", "employeeNo": "PSA1043-006", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm7nh3s0036iausxm44cu9t", "slug": "marivic-r-escobido", "email": "m.escobido@psa.gov.ph", "section": "Civil Registration and Vital Statistics", "fullName": "Marivic R. Escobido", "isActive": true, "photoUrl": "/uploads/personnel/1780170989546-356.webp", "position": "SG 14 - Registration Officer II", "contactNo": null, "createdAt": "2026-05-26T05:44:36.953Z", "updatedAt": "2026-05-30T19:56:29.557Z", "employeeNo": "PSA1043-006", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:56:29.563
cmpsrvbpq000xialotnr5d9av	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm7y2d5003uiaushuvnjj0w	{"id": "cmpm7y2d5003uiaushuvnjj0w", "slug": "may-t-dublin", "email": "m.dublin@psa.gov.ph", "section": "Civil Registration and Vital Statistics", "fullName": "May T. Dublin", "isActive": true, "photoUrl": null, "position": "SG 10 - Registration Officer I", "contactNo": null, "createdAt": "2026-05-26T05:52:51.066Z", "updatedAt": "2026-05-26T05:52:51.066Z", "employeeNo": "PSA1043-016", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm7y2d5003uiaushuvnjj0w", "slug": "may-t-dublin", "email": "m.dublin@psa.gov.ph", "section": "Civil Registration and Vital Statistics", "fullName": "May T. Dublin", "isActive": true, "photoUrl": "/uploads/personnel/1780171032577-127.webp", "position": "SG 10 - Registration Officer I", "contactNo": null, "createdAt": "2026-05-26T05:52:51.066Z", "updatedAt": "2026-05-30T19:57:12.585Z", "employeeNo": "PSA1043-016", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:57:12.59
cmpsrxg8j000zialoh0c0u8ru	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmcyll0005tiaus9udmpd06	{"id": "cmpmcyll0005tiaus9udmpd06", "slug": "clarissa-l-nico", "email": "c.nico.psa@gmail.com", "section": "Statistical Operations", "fullName": "Clarissa L. Nico", "isActive": true, "photoUrl": null, "position": "SG 9 - Assistant Statistician", "contactNo": null, "createdAt": "2026-05-26T08:13:14.053Z", "updatedAt": "2026-05-26T08:13:14.053Z", "employeeNo": "PSA1043-037", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmcyll0005tiaus9udmpd06", "slug": "clarissa-l-nico", "email": "c.nico.psa@gmail.com", "section": "Statistical Operations", "fullName": "Clarissa L. Nico", "isActive": true, "photoUrl": "/uploads/personnel/1780171131749-358.webp", "position": "SG 9 - Assistant Statistician", "contactNo": null, "createdAt": "2026-05-26T08:13:14.053Z", "updatedAt": "2026-05-30T19:58:51.758Z", "employeeNo": "PSA1043-037", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:58:51.764
cmpsry6cc0011ialo56z05l8l	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm71afq0031iausuxhheoyf	{"id": "cmpm71afq0031iausuxhheoyf", "slug": "deana-dell-b-pornia", "email": "d.pornia@psa.gov.ph", "section": "Statistical Operations", "fullName": "Deana Dell B. Pornia", "isActive": true, "photoUrl": null, "position": "SG 16 - Statistical Specialist II", "contactNo": null, "createdAt": "2026-05-26T05:27:21.878Z", "updatedAt": "2026-05-26T05:27:21.878Z", "employeeNo": "PSA1043-005", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm71afq0031iausuxhheoyf", "slug": "deana-dell-b-pornia", "email": "d.pornia@psa.gov.ph", "section": "Statistical Operations", "fullName": "Deana Dell B. Pornia", "isActive": true, "photoUrl": "/uploads/personnel/1780171165582-536.webp", "position": "SG 16 - Statistical Specialist II", "contactNo": null, "createdAt": "2026-05-26T05:27:21.878Z", "updatedAt": "2026-05-30T19:59:25.592Z", "employeeNo": "PSA1043-005", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:59:25.596
cmpsrytx70013ialov4dywamu	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmakc8i004liaus6oylw747	{"id": "cmpmakc8i004liaus6oylw747", "slug": "kathleen-marie-p-medel", "email": "k.medel.psa@gmail.com", "section": "Statistical Operations", "fullName": "Kathleen Marie P. Medel", "isActive": true, "photoUrl": null, "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T07:06:09.523Z", "updatedAt": "2026-05-26T07:06:09.523Z", "employeeNo": "PSA1043-025", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmakc8i004liaus6oylw747", "slug": "kathleen-marie-p-medel", "email": "k.medel.psa@gmail.com", "section": "Statistical Operations", "fullName": "Kathleen Marie P. Medel", "isActive": true, "photoUrl": "/uploads/personnel/1780171196138-241.webp", "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T07:06:09.523Z", "updatedAt": "2026-05-30T19:59:56.148Z", "employeeNo": "PSA1043-025", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 19:59:56.155
cmpsrzwk50015ialoi85enf2a	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm70pwb002yiaus2m2fx6w0	{"id": "cmpm70pwb002yiaus2m2fx6w0", "slug": "lee-charge-s-cailing", "email": "l.cailing@psa.gov.ph", "section": "Statistical Operations", "fullName": "Lee Charge S. Cailing", "isActive": true, "photoUrl": null, "position": "SG 16 - Statistical Specialist II", "contactNo": null, "createdAt": "2026-05-26T05:26:55.259Z", "updatedAt": "2026-05-26T05:26:55.259Z", "employeeNo": "PSA1043-004", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm70pwb002yiaus2m2fx6w0", "slug": "lee-charge-s-cailing", "email": "l.cailing@psa.gov.ph", "section": "Statistical Operations", "fullName": "Lee Charge S. Cailing", "isActive": true, "photoUrl": "/uploads/personnel/1780171246216-89.webp", "position": "SG 16 - Statistical Specialist II", "contactNo": null, "createdAt": "2026-05-26T05:26:55.259Z", "updatedAt": "2026-05-30T20:00:46.225Z", "employeeNo": "PSA1043-004", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:00:46.23
cmpss0uty0017ialoz9x9mupb	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmcug27005hiauszp8pd7lt	{"id": "cmpmcug27005hiauszp8pd7lt", "slug": "sheila-p-degala", "email": "s.degala.psa@gmail.com", "section": "Statistical Operations", "fullName": "Sheila P. Degala", "isActive": true, "photoUrl": null, "position": "SG 9 - Assistant Statistician*", "contactNo": null, "createdAt": "2026-05-26T08:10:00.271Z", "updatedAt": "2026-05-26T08:10:00.271Z", "employeeNo": "PSA1043-033", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmcug27005hiauszp8pd7lt", "slug": "sheila-p-degala", "email": "s.degala.psa@gmail.com", "section": "Statistical Operations", "fullName": "Sheila P. Degala", "isActive": true, "photoUrl": "/uploads/personnel/1780171290632-190.webp", "position": "SG 9 - Assistant Statistician*", "contactNo": null, "createdAt": "2026-05-26T08:10:00.271Z", "updatedAt": "2026-05-30T20:01:30.641Z", "employeeNo": "PSA1043-033", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:01:30.646
cmpss2p2u0019ialo484y9w5k	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm7sv69003oiausjksd398m	{"id": "cmpm7sv69003oiausjksd398m", "slug": "merlie-t-montera", "email": "m.montera@psa.gov.ph", "section": "Statistical Operations", "fullName": "Merlie T. Montera", "isActive": true, "photoUrl": null, "position": "SG 9 - Assistant Statistician", "contactNo": null, "createdAt": "2026-05-26T05:48:48.466Z", "updatedAt": "2026-05-26T05:48:48.466Z", "employeeNo": "PSA1043-014", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm7sv69003oiausjksd398m", "slug": "merlie-t-montera", "email": "m.montera@psa.gov.ph", "section": "Statistical Operations", "fullName": "Merlie T. Montera", "isActive": true, "photoUrl": "/uploads/personnel/1780171376490-229.webp", "position": "SG 9 - Assistant Statistician", "contactNo": null, "createdAt": "2026-05-26T05:48:48.466Z", "updatedAt": "2026-05-30T20:02:56.498Z", "employeeNo": "PSA1043-014", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:02:56.502
cmpss3jdi001bialooxvlbt42	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmcsydy005biaus8mz8wrn4	{"id": "cmpmcsydy005biaus8mz8wrn4", "slug": "rodelyn-navarosa", "email": "r.navarosa.psa@gmail.com", "section": "Statistical Operations", "fullName": "Rodelyn Navarosa", "isActive": true, "photoUrl": null, "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:08:50.710Z", "updatedAt": "2026-05-26T08:08:50.710Z", "employeeNo": "PSA1043-031", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmcsydy005biaus8mz8wrn4", "slug": "rodelyn-navarosa", "email": "r.navarosa.psa@gmail.com", "section": "Statistical Operations", "fullName": "Rodelyn Navarosa", "isActive": true, "photoUrl": "/uploads/personnel/1780171415751-31.webp", "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:08:50.710Z", "updatedAt": "2026-05-30T20:03:35.761Z", "employeeNo": "PSA1043-031", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:03:35.767
cmpss4iy6001dialop6l4kzsz	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm7q17h003fiausimucssfj	{"id": "cmpm7q17h003fiausimucssfj", "slug": "milan-l-gutay", "email": "m.gutay@psa.gov.ph", "section": "Statistical Operations", "fullName": "Milan L. Gutay", "isActive": true, "photoUrl": null, "position": "SG 16 - Statistical Specialist II", "contactNo": null, "createdAt": "2026-05-26T05:46:36.318Z", "updatedAt": "2026-05-26T05:46:36.318Z", "employeeNo": "PSA1043-010", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm7q17h003fiausimucssfj", "slug": "milan-l-gutay", "email": "m.gutay@psa.gov.ph", "section": "Statistical Operations", "fullName": "Milan L. Gutay", "isActive": true, "photoUrl": "/uploads/personnel/1780171461852-837.webp", "position": "SG 16 - Statistical Specialist II", "contactNo": null, "createdAt": "2026-05-26T05:46:36.318Z", "updatedAt": "2026-05-30T20:04:21.863Z", "employeeNo": "PSA1043-010", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:04:21.87
cmpss539q001fialonsdaz1n0	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmd0y8g005ziausnc38ns1g	{"id": "cmpmd0y8g005ziausnc38ns1g", "slug": "sheila-may-d-regular", "email": "s.regular.psa@gmail.com", "section": "Statistical Operations", "fullName": "Sheila May D. Regular", "isActive": true, "photoUrl": null, "position": "SG 11 - Statistical Analyst*", "contactNo": null, "createdAt": "2026-05-26T08:15:03.760Z", "updatedAt": "2026-05-26T08:15:03.760Z", "employeeNo": "PSA1043-039", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmd0y8g005ziausnc38ns1g", "slug": "sheila-may-d-regular", "email": "s.regular.psa@gmail.com", "section": "Statistical Operations", "fullName": "Sheila May D. Regular", "isActive": true, "photoUrl": "/uploads/personnel/1780171488194-716.webp", "position": "SG 11 - Statistical Analyst*", "contactNo": null, "createdAt": "2026-05-26T08:15:03.760Z", "updatedAt": "2026-05-30T20:04:48.202Z", "employeeNo": "PSA1043-039", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:04:48.207
cmpss6qgv001hialoxivvqxc0	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmctto9005eiaus7jv5w8sw	{"id": "cmpmctto9005eiaus7jv5w8sw", "slug": "queenie-marie-b-casi-o", "email": "q.casino.psa@gmail.com", "section": "Statistical Operations", "fullName": "Queenie Marie B. Casiño", "isActive": true, "photoUrl": null, "position": "SG 11 - Statistical Analyst*", "contactNo": null, "createdAt": "2026-05-26T08:09:31.258Z", "updatedAt": "2026-05-26T08:09:31.258Z", "employeeNo": "PSA1043-032", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmctto9005eiaus7jv5w8sw", "slug": "queenie-marie-b-casi-o", "email": "q.casino.psa@gmail.com", "section": "Statistical Operations", "fullName": "Queenie Marie B. Casiño", "isActive": true, "photoUrl": "/uploads/personnel/1780171564908-106.webp", "position": "SG 11 - Statistical Analyst*", "contactNo": null, "createdAt": "2026-05-26T08:09:31.258Z", "updatedAt": "2026-05-30T20:06:04.922Z", "employeeNo": "PSA1043-032", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:06:04.928
cmpss8zpu001jialoptdtrj3e	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmcwkjj005niausxhpwr0rq	{"id": "cmpmcwkjj005niausxhpwr0rq", "slug": "paula-p-dedumo", "email": "p.dedumo.psa@gmail.com", "section": "Statistical Operations", "fullName": "Paula P. Dedumo", "isActive": true, "photoUrl": null, "position": "SG 11 - Statistical Analyst*", "contactNo": null, "createdAt": "2026-05-26T08:11:39.392Z", "updatedAt": "2026-05-26T08:11:39.392Z", "employeeNo": "PSA1043-035", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmcwkjj005niausxhpwr0rq", "slug": "paula-p-dedumo", "email": "p.dedumo.psa@gmail.com", "section": "Statistical Operations", "fullName": "Paula P. Dedumo", "isActive": true, "photoUrl": "/uploads/personnel/1780171670208-599.webp", "position": "SG 11 - Statistical Analyst*", "contactNo": null, "createdAt": "2026-05-26T08:11:39.392Z", "updatedAt": "2026-05-30T20:07:50.218Z", "employeeNo": "PSA1043-035", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:07:50.227
cmpss9fjz001lialof4u3liol	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm7wjyu003riaus32ihl37b	{"id": "cmpm7wjyu003riaus32ihl37b", "slug": "cindy-b-dumaloan", "email": null, "section": "Civil Registration and Vital Statistics", "fullName": "Cindy B. Dumaloan", "isActive": true, "photoUrl": "/uploads/personnel/1780170888926-603.webp", "position": "SG 10 - Registration Officer I", "contactNo": null, "createdAt": "2026-05-26T05:51:40.567Z", "updatedAt": "2026-05-30T19:54:48.935Z", "employeeNo": "PSA1043-015", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm7wjyu003riaus32ihl37b", "slug": "cindy-b-dumaloan", "email": "c.dumaloan@psa.gov.ph", "section": "Civil Registration and Vital Statistics", "fullName": "Cindy B. Dumaloan", "isActive": true, "photoUrl": "/uploads/personnel/1780170888926-603.webp", "position": "SG 10 - Registration Officer I", "contactNo": null, "createdAt": "2026-05-26T05:51:40.567Z", "updatedAt": "2026-05-30T20:08:10.746Z", "employeeNo": "PSA1043-015", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:08:10.752
cmpss9wl8001nialoijmmd693	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpm4p7n6001qiausf4s5ahht	{"id": "cmpm4p7n6001qiausf4s5ahht", "slug": "grad-lucky-mark-n-arcega", "email": "g.arcega.psa@gmail.com", "section": "Statistical Operations", "fullName": "Grad Lucky Mark N. Arcega", "isActive": true, "photoUrl": null, "position": "SG 11 - Statistical Analyst", "contactNo": null, "createdAt": "2026-05-26T04:21:59.155Z", "updatedAt": "2026-05-26T04:21:59.155Z", "employeeNo": "PSA1043-011", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpm4p7n6001qiausf4s5ahht", "slug": "grad-lucky-mark-n-arcega", "email": "g.arcega@psa.gov.ph", "section": "Statistical Operations", "fullName": "Grad Lucky Mark N. Arcega", "isActive": true, "photoUrl": null, "position": "SG 11 - Statistical Analyst", "contactNo": null, "createdAt": "2026-05-26T04:21:59.155Z", "updatedAt": "2026-05-30T20:08:32.824Z", "employeeNo": "PSA1043-011", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:08:32.828
cmpssj18n001pialozf0brcs4	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmakc8i004liaus6oylw747	{"id": "cmpmakc8i004liaus6oylw747", "slug": "kathleen-marie-p-medel", "email": "k.medel.psa@gmail.com", "section": "Statistical Operations", "fullName": "Kathleen Marie P. Medel", "isActive": true, "photoUrl": "/uploads/personnel/1780171196138-241.webp", "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T07:06:09.523Z", "updatedAt": "2026-05-30T19:59:56.148Z", "employeeNo": "PSA1043-025", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmakc8i004liaus6oylw747", "slug": "kathleen-marie-p-medel", "email": "k.medel.psa@gmail.com", "section": "Statistical Operations", "fullName": "Kathleen Marie P. Medel", "isActive": true, "photoUrl": "/uploads/personnel/1780171196138-241.webp", "position": "Data Encoder*", "contactNo": "09190035256", "createdAt": "2026-05-26T07:06:09.523Z", "updatedAt": "2026-05-30T20:15:38.749Z", "employeeNo": "PSA1043-025", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:15:38.759
cmpssjeze001rialox56gizq9	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmakc8i004liaus6oylw747	{"id": "cmpmakc8i004liaus6oylw747", "slug": "kathleen-marie-p-medel", "email": "k.medel.psa@gmail.com", "section": "Statistical Operations", "fullName": "Kathleen Marie P. Medel", "isActive": true, "photoUrl": "/uploads/personnel/1780171196138-241.webp", "position": "Data Encoder*", "contactNo": "09190035256", "createdAt": "2026-05-26T07:06:09.523Z", "updatedAt": "2026-05-30T20:15:38.749Z", "employeeNo": "PSA1043-025", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmakc8i004liaus6oylw747", "slug": "kathleen-marie-p-medel", "email": "k.medel.psa@gmail.com", "section": "Statistical Operations", "fullName": "Kathleen Marie P. Medel", "isActive": true, "photoUrl": "/uploads/personnel/1780171196138-241.webp", "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T07:06:09.523Z", "updatedAt": "2026-05-30T20:15:56.565Z", "employeeNo": "PSA1043-025", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-30 20:15:56.57
cmpt56gkz002eialo57ltguge	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-31 02:09:47.123
cmpt57tus002gialowrejt4er	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmanuku004yiaush28acnzm	{"id": "cmpmanuku004yiaush28acnzm", "slug": "christian-bryan-abaragan", "email": null, "section": "N/A", "fullName": "Christian Bryan Abaragan", "isActive": true, "photoUrl": null, "position": "Utility*", "contactNo": null, "createdAt": "2026-05-26T07:08:53.262Z", "updatedAt": "2026-05-26T07:08:53.262Z", "employeeNo": "PSA1043-028", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmanuku004yiaush28acnzm", "slug": "christian-bryan-a-abaragan", "email": null, "section": "N/A", "fullName": "Christian Bryan A. Abaragan", "isActive": true, "photoUrl": null, "position": "Utility*", "contactNo": null, "createdAt": "2026-05-26T07:08:53.262Z", "updatedAt": "2026-05-31T02:10:50.970Z", "employeeNo": "PSA1043-028", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-31 02:10:50.981
cmpt589t9002iialoqot2w9e0	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmcmiud0058iaustuwfw2sp	{"id": "cmpmcmiud0058iaustuwfw2sp", "slug": "angel-marie-guillena", "email": "a.guillena.psa@gmail.com", "section": "Administrative and Accounting", "fullName": "Angel Marie Guillena", "isActive": true, "photoUrl": "/uploads/personnel/1780170581446-215.webp", "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:03:50.629Z", "updatedAt": "2026-05-30T19:49:41.454Z", "employeeNo": "PSA1043-030", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmcmiud0058iaustuwfw2sp", "slug": "angel-marie-c-guillena", "email": "a.guillena.psa@gmail.com", "section": "Administrative and Accounting", "fullName": "Angel Marie C. Guillena", "isActive": true, "photoUrl": "/uploads/personnel/1780170581446-215.webp", "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:03:50.629Z", "updatedAt": "2026-05-31T02:11:11.648Z", "employeeNo": "PSA1043-030", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-31 02:11:11.661
cmpt58lnq002kialohgtgfvgd	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmcsydy005biaus8mz8wrn4	{"id": "cmpmcsydy005biaus8mz8wrn4", "slug": "rodelyn-navarosa", "email": "r.navarosa.psa@gmail.com", "section": "Statistical Operations", "fullName": "Rodelyn Navarosa", "isActive": true, "photoUrl": "/uploads/personnel/1780171415751-31.webp", "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:08:50.710Z", "updatedAt": "2026-05-30T20:03:35.761Z", "employeeNo": "PSA1043-031", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmcsydy005biaus8mz8wrn4", "slug": "rodelyn-e-navarosa", "email": "r.navarosa.psa@gmail.com", "section": "Statistical Operations", "fullName": "Rodelyn E. Navarosa", "isActive": true, "photoUrl": "/uploads/personnel/1780171415751-31.webp", "position": "Data Encoder*", "contactNo": null, "createdAt": "2026-05-26T08:08:50.710Z", "updatedAt": "2026-05-31T02:11:27.009Z", "employeeNo": "PSA1043-031", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-31 02:11:27.015
cmpt58xs1002mialoo0pjg5fn	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmbbun40051iaus0ypzmgo0	{"id": "cmpmbbun40051iaus0ypzmgo0", "slug": "christian-jen-labado", "email": "c.labado.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Christian Jen Labado", "isActive": true, "photoUrl": null, "position": "SG 14 - Registration Officer II*", "contactNo": null, "createdAt": "2026-05-26T07:27:33.088Z", "updatedAt": "2026-05-26T07:27:33.088Z", "employeeNo": "PSA1043-029", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmbbun40051iaus0ypzmgo0", "slug": "christian-jen-d-labado", "email": "c.labado.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Christian Jen D. Labado", "isActive": true, "photoUrl": null, "position": "SG 14 - Registration Officer II*", "contactNo": null, "createdAt": "2026-05-26T07:27:33.088Z", "updatedAt": "2026-05-31T02:11:42.717Z", "employeeNo": "PSA1043-029", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-31 02:11:42.721
cmptyh56200cqialo1lja0dek	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-05-31 15:49:54.411
cmptymcnu00e1ialo1q9gkt31	cmpp3gnhz0007iafkfwlwufi4	LOGIN	User	cmpp3gnhz0007iafkfwlwufi4	\N	\N	\N	\N	2026-05-31 15:53:57.403
cmptymrjt00e6ialokqc0usnc	cmpp3gnhz0007iafkfwlwufi4	LOGIN	User	cmpp3gnhz0007iafkfwlwufi4	\N	\N	\N	\N	2026-05-31 15:54:16.697
cmptymsbs00e8ialojhu42apq	cmpp3gnhz0007iafkfwlwufi4	LOGIN	User	cmpp3gnhz0007iafkfwlwufi4	\N	\N	\N	\N	2026-05-31 15:54:17.705
cmptz5smg00hjialoagvhtue2	cmplkm5x70000iaeg6ej70tgq	UPDATE	Personnel	cmpmaayyh0049iausqyybqoai	{"id": "cmpmaayyh0049iausqyybqoai", "slug": "claudevan-a-macabale", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Claudevan A. Macabale", "isActive": true, "photoUrl": null, "position": "SG 12 - Information System Analyst I**", "contactNo": "09696018203", "createdAt": "2026-05-26T06:58:52.409Z", "updatedAt": "2026-05-26T06:58:52.409Z", "employeeNo": "PSA1043-021", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	{"id": "cmpmaayyh0049iausqyybqoai", "slug": "claudevan-a-macabale", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Claudevan A. Macabale", "isActive": true, "photoUrl": "/uploads/personnel/1780243744525-646.webp", "position": "SG 12 - Information System Analyst I**", "contactNo": "09696018203", "createdAt": "2026-05-26T06:58:52.409Z", "updatedAt": "2026-05-31T16:09:04.544Z", "employeeNo": "PSA1043-021", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": null, "locationStatus": "office", "travelStartDate": null, "travelDestination": null}	\N	\N	2026-05-31 16:09:04.552
cmpvyfyrq0001iaggq4ysiz9v	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-06-02 01:24:31.813
cmpwgxmo90001ia40813tgw13	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-06-02 10:02:09.033
cmpx9xl460001ia7scfclxrfi	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-06-02 23:33:55.875
cmpxhkl820012iat0crfyyn25	cmpp3gnhz0007iafkfwlwufi4	LOGIN	User	cmpp3gnhz0007iafkfwlwufi4	\N	\N	\N	\N	2026-06-03 03:07:46.419
cmpxsystd0001ia50gaaz97u2	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-06-03 08:26:45.217
cmpy0zf440001ia30g87cfi7t	cmpp3gnhz0007iafkfwlwufi4	LOGIN	User	cmpp3gnhz0007iafkfwlwufi4	\N	\N	\N	\N	2026-06-03 12:11:11.043
cmpy1jib00006ia3025z24fig	cmpp3gnhz0007iafkfwlwufi4	CANCEL	RoomReservation	cmpp40flj000xiafk3c3b50ct	{"id": "cmpp40flj000xiafk3c3b50ct", "roomId": "room_training", "status": "APPROVED", "endDate": "2026-06-02T16:00:00.000Z", "purpose": "Training for PhilSys", "remarks": null, "createdAt": "2026-05-28T06:26:01.592Z", "startDate": "2026-05-31T16:00:00.000Z", "updatedAt": "2026-05-28T06:26:26.510Z", "approvedAt": "2026-05-28T06:26:26.488Z", "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": "cmplkm5x70000iaeg6ej70tgq", "rejectedById": null, "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpp40flj000xiafk3c3b50ct", "roomId": "room_training", "status": "CANCELLED", "endDate": "2026-06-02T16:00:00.000Z", "purpose": "Training for PhilSys", "remarks": null, "createdAt": "2026-05-28T06:26:01.592Z", "startDate": "2026-05-31T16:00:00.000Z", "updatedAt": "2026-06-03T12:26:48.075Z", "approvedAt": "2026-05-28T06:26:26.488Z", "rejectedAt": null, "cancelledAt": "2026-06-03T12:26:48.073Z", "halfDaySlot": null, "approvedById": "cmplkm5x70000iaeg6ej70tgq", "rejectedById": null, "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 12:26:48.3
cmpy28qfo0004iaecdeje0ggd	cmpp3gnhz0007iafkfwlwufi4	CREATE	RoomReservation	cmpy28qfe0002iaecqowhu7bh	\N	{"id": "cmpy28qfe0002iaecqowhu7bh", "roomId": "room_pantry_1", "status": "PENDING", "endDate": "2026-06-09T16:00:00.000Z", "purpose": "Training for Super Saiyan", "remarks": null, "createdAt": "2026-06-03T12:46:25.227Z", "startDate": "2026-06-09T16:00:00.000Z", "updatedAt": "2026-06-03T12:46:25.227Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": "MORNING", "approvedById": null, "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "HALF_DAY", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 12:46:25.236
cmpy36boe000ciaec2s1bdi50	cmplkm5x70000iaeg6ej70tgq	UPDATE	RoomReservation	cmpy28qfe0002iaecqowhu7bh	{"id": "cmpy28qfe0002iaecqowhu7bh", "room": {"id": "room_pantry_1", "name": "Pantry 1", "isActive": true, "createdAt": "2026-05-28T13:30:52.976Z", "updatedAt": "2026-05-28T13:30:52.976Z", "isAvailable": true, "unavailableReason": null}, "roomId": "room_pantry_1", "status": "PENDING", "endDate": "2026-06-09T16:00:00.000Z", "purpose": "Training for Super Saiyan", "remarks": null, "createdAt": "2026-06-03T12:46:25.227Z", "requester": {"id": "cmpmaayyh0049iausqyybqoai", "slug": "claudevan-a-macabale", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Claudevan A. Macabale", "isActive": true, "photoUrl": "/uploads/personnel/1780243744525-646.webp", "position": "SG 12 - Information System Analyst I**", "contactNo": "09696018203", "createdAt": "2026-05-26T06:58:52.409Z", "updatedAt": "2026-06-02T10:07:40.577Z", "employeeNo": "PSA1043-021", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": "2026-05-11T16:00:00.000Z", "locationStatus": "on_travel", "travelStartDate": "2026-05-10T16:00:00.000Z", "travelDestination": "El Salvador City, Misamis Oriental"}, "startDate": "2026-06-09T16:00:00.000Z", "updatedAt": "2026-06-03T12:46:25.227Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": "MORNING", "approvedById": null, "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "HALF_DAY", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpy28qfe0002iaecqowhu7bh", "roomId": "room_pantry_1", "status": "REJECTED", "endDate": "2026-06-09T16:00:00.000Z", "purpose": "Training for Super Saiyan", "remarks": null, "createdAt": "2026-06-03T12:46:25.227Z", "startDate": "2026-06-09T16:00:00.000Z", "updatedAt": "2026-06-03T13:12:32.327Z", "approvedAt": null, "rejectedAt": "2026-06-03T13:12:32.325Z", "cancelledAt": null, "halfDaySlot": "MORNING", "approvedById": null, "rejectedById": "cmplkm5x70000iaeg6ej70tgq", "specialOrderId": null, "rejectionReason": "Gonna use it for higher priority event", "reservationType": "HALF_DAY", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 13:12:32.414
cmpy5igzh0063iaec0m6p424i	cmpp3gnhz0007iafkfwlwufi4	CREATE	RoomReservation	cmpy5igz80061iaecxylz0rmu	\N	{"id": "cmpy5igz80061iaecxylz0rmu", "roomId": "room_pantry_1", "status": "PENDING", "endDate": "2026-06-04T16:00:00.000Z", "purpose": "Training", "remarks": null, "createdAt": "2026-06-03T14:17:58.388Z", "startDate": "2026-06-03T16:00:00.000Z", "updatedAt": "2026-06-03T14:17:58.388Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": null, "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 14:17:58.397
cmpy5j8vc006aiaec76ig1h2k	cmpp3gnhz0007iafkfwlwufi4	CREATE	RoomReservation	cmpy5j8v70068iaecnybvds3e	\N	{"id": "cmpy5j8v70068iaecnybvds3e", "roomId": "room_pantry_2", "status": "PENDING", "endDate": "2026-06-04T16:00:00.000Z", "purpose": "test", "remarks": null, "createdAt": "2026-06-03T14:18:34.531Z", "startDate": "2026-06-04T16:00:00.000Z", "updatedAt": "2026-06-03T14:18:34.531Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": "MORNING", "approvedById": null, "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "HALF_DAY", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 14:18:34.537
cmpy5k34m006hiaec6u0ee6tv	cmpp3gnhz0007iafkfwlwufi4	CREATE	RoomReservation	cmpy5k34e006fiaeck4wowo3u	\N	{"id": "cmpy5k34e006fiaeck4wowo3u", "roomId": "room_training", "status": "PENDING", "endDate": "2026-06-07T16:00:00.000Z", "purpose": "test", "remarks": null, "createdAt": "2026-06-03T14:19:13.742Z", "startDate": "2026-06-07T16:00:00.000Z", "updatedAt": "2026-06-03T14:19:13.742Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": null, "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "SINGLE_DAY", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 14:19:13.75
cmpy6ireb009oiaeco188ir4k	cmplkm5x70000iaeg6ej70tgq	UPDATE	RoomReservation	cmpy5k34e006fiaeck4wowo3u	{"id": "cmpy5k34e006fiaeck4wowo3u", "room": {"id": "room_training", "name": "Training Room", "isActive": true, "createdAt": "2026-05-28T13:30:52.976Z", "updatedAt": "2026-05-28T13:30:52.976Z", "isAvailable": true, "unavailableReason": null}, "roomId": "room_training", "status": "PENDING", "endDate": "2026-06-07T16:00:00.000Z", "purpose": "test", "remarks": null, "createdAt": "2026-06-03T14:19:13.742Z", "requester": {"id": "cmpmaayyh0049iausqyybqoai", "slug": "claudevan-a-macabale", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Claudevan A. Macabale", "isActive": true, "photoUrl": "/uploads/personnel/1780243744525-646.webp", "position": "SG 12 - Information System Analyst I**", "contactNo": "09696018203", "createdAt": "2026-05-26T06:58:52.409Z", "updatedAt": "2026-06-02T10:07:40.577Z", "employeeNo": "PSA1043-021", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": "2026-05-11T16:00:00.000Z", "locationStatus": "on_travel", "travelStartDate": "2026-05-10T16:00:00.000Z", "travelDestination": "El Salvador City, Misamis Oriental"}, "startDate": "2026-06-07T16:00:00.000Z", "updatedAt": "2026-06-03T14:19:13.742Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": null, "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "SINGLE_DAY", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpy5k34e006fiaeck4wowo3u", "roomId": "room_training", "status": "APPROVED", "endDate": "2026-06-07T16:00:00.000Z", "purpose": "test", "remarks": null, "createdAt": "2026-06-03T14:19:13.742Z", "startDate": "2026-06-07T16:00:00.000Z", "updatedAt": "2026-06-03T14:46:11.460Z", "approvedAt": "2026-06-03T14:46:11.457Z", "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": "cmplkm5x70000iaeg6ej70tgq", "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "SINGLE_DAY", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 14:46:11.507
cmpy9rbb400biiaecn89cvi62	cmpp3gnhz0007iafkfwlwufi4	CREATE	VehicleRequest	cmpy9rbat00b7iaecdd6xlwz4	\N	{"id": "cmpy9rbat00b7iaecdd6xlwz4", "status": "PENDING", "purpose": "Supervisionaryefewgtrwk;gkrwgk;tkg;2g;2;gdgdegf", "soNumber": null, "createdAt": "2026-06-03T16:16:49.397Z", "soFileUrl": null, "updatedAt": "2026-06-03T16:16:49.397Z", "adminNotes": null, "travelDate": "2026-06-04T16:00:00.000Z", "departureAt": "2026-06-04T22:00:00.000Z", "destination": "Sugbongcogon, Misamis Oriental, Talisayan, Misamis Oriental, Magsaysay, Misamis Oreintal", "reviewedById": null, "rejectionReason": null, "expectedReturnAt": "2026-06-05T09:00:00.000Z", "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 16:16:49.408
cmpy6it8h009viaecpetp2c3x	cmplkm5x70000iaeg6ej70tgq	UPDATE	RoomReservation	cmpy5j8v70068iaecnybvds3e	{"id": "cmpy5j8v70068iaecnybvds3e", "room": {"id": "room_pantry_2", "name": "Pantry 2", "isActive": true, "createdAt": "2026-05-28T13:30:52.976Z", "updatedAt": "2026-05-28T13:30:52.976Z", "isAvailable": true, "unavailableReason": null}, "roomId": "room_pantry_2", "status": "PENDING", "endDate": "2026-06-04T16:00:00.000Z", "purpose": "test", "remarks": null, "createdAt": "2026-06-03T14:18:34.531Z", "requester": {"id": "cmpmaayyh0049iausqyybqoai", "slug": "claudevan-a-macabale", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Claudevan A. Macabale", "isActive": true, "photoUrl": "/uploads/personnel/1780243744525-646.webp", "position": "SG 12 - Information System Analyst I**", "contactNo": "09696018203", "createdAt": "2026-05-26T06:58:52.409Z", "updatedAt": "2026-06-02T10:07:40.577Z", "employeeNo": "PSA1043-021", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": "2026-05-11T16:00:00.000Z", "locationStatus": "on_travel", "travelStartDate": "2026-05-10T16:00:00.000Z", "travelDestination": "El Salvador City, Misamis Oriental"}, "startDate": "2026-06-04T16:00:00.000Z", "updatedAt": "2026-06-03T14:18:34.531Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": "MORNING", "approvedById": null, "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "HALF_DAY", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpy5j8v70068iaecnybvds3e", "roomId": "room_pantry_2", "status": "APPROVED", "endDate": "2026-06-04T16:00:00.000Z", "purpose": "test", "remarks": null, "createdAt": "2026-06-03T14:18:34.531Z", "startDate": "2026-06-04T16:00:00.000Z", "updatedAt": "2026-06-03T14:46:13.857Z", "approvedAt": "2026-06-03T14:46:13.855Z", "rejectedAt": null, "cancelledAt": null, "halfDaySlot": "MORNING", "approvedById": "cmplkm5x70000iaeg6ej70tgq", "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "HALF_DAY", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 14:46:13.889
cmpy6iuwn00a2iaecg1rpoyjm	cmplkm5x70000iaeg6ej70tgq	UPDATE	RoomReservation	cmpy5igz80061iaecxylz0rmu	{"id": "cmpy5igz80061iaecxylz0rmu", "room": {"id": "room_pantry_1", "name": "Pantry 1", "isActive": true, "createdAt": "2026-05-28T13:30:52.976Z", "updatedAt": "2026-05-28T13:30:52.976Z", "isAvailable": true, "unavailableReason": null}, "roomId": "room_pantry_1", "status": "PENDING", "endDate": "2026-06-04T16:00:00.000Z", "purpose": "Training", "remarks": null, "createdAt": "2026-06-03T14:17:58.388Z", "requester": {"id": "cmpmaayyh0049iausqyybqoai", "slug": "claudevan-a-macabale", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Claudevan A. Macabale", "isActive": true, "photoUrl": "/uploads/personnel/1780243744525-646.webp", "position": "SG 12 - Information System Analyst I**", "contactNo": "09696018203", "createdAt": "2026-05-26T06:58:52.409Z", "updatedAt": "2026-06-02T10:07:40.577Z", "employeeNo": "PSA1043-021", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": "2026-05-11T16:00:00.000Z", "locationStatus": "on_travel", "travelStartDate": "2026-05-10T16:00:00.000Z", "travelDestination": "El Salvador City, Misamis Oriental"}, "startDate": "2026-06-03T16:00:00.000Z", "updatedAt": "2026-06-03T14:17:58.388Z", "approvedAt": null, "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": null, "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpy5igz80061iaecxylz0rmu", "roomId": "room_pantry_1", "status": "APPROVED", "endDate": "2026-06-04T16:00:00.000Z", "purpose": "Training", "remarks": null, "createdAt": "2026-06-03T14:17:58.388Z", "startDate": "2026-06-03T16:00:00.000Z", "updatedAt": "2026-06-03T14:46:16.026Z", "approvedAt": "2026-06-03T14:46:16.024Z", "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": "cmplkm5x70000iaeg6ej70tgq", "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 14:46:16.055
cmpy8kqjj00ahiaecz852fxna	cmplkm5x70000iaeg6ej70tgq	UPDATE	RoomReservation	cmpy5igz80061iaecxylz0rmu	{"id": "cmpy5igz80061iaecxylz0rmu", "room": {"id": "room_pantry_1", "name": "Pantry 1", "isActive": true, "createdAt": "2026-05-28T13:30:52.976Z", "updatedAt": "2026-05-28T13:30:52.976Z", "isAvailable": true, "unavailableReason": null}, "roomId": "room_pantry_1", "status": "APPROVED", "endDate": "2026-06-04T16:00:00.000Z", "purpose": "Training", "remarks": null, "createdAt": "2026-06-03T14:17:58.388Z", "requester": {"id": "cmpmaayyh0049iausqyybqoai", "slug": "claudevan-a-macabale", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Claudevan A. Macabale", "isActive": true, "photoUrl": "/uploads/personnel/1780243744525-646.webp", "position": "SG 12 - Information System Analyst I**", "contactNo": "09696018203", "createdAt": "2026-05-26T06:58:52.409Z", "updatedAt": "2026-06-02T10:07:40.577Z", "employeeNo": "PSA1043-021", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": "2026-05-11T16:00:00.000Z", "locationStatus": "on_travel", "travelStartDate": "2026-05-10T16:00:00.000Z", "travelDestination": "El Salvador City, Misamis Oriental"}, "startDate": "2026-06-03T16:00:00.000Z", "updatedAt": "2026-06-03T14:46:16.039Z", "approvedAt": "2026-06-03T14:46:16.024Z", "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": "cmplkm5x70000iaeg6ej70tgq", "rejectedById": null, "specialOrderId": null, "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": "cmpy6iuw4009xiaeclgtjdytf", "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpy5igz80061iaecxylz0rmu", "roomId": "room_pantry_1", "status": "APPROVED", "endDate": "2026-06-04T16:00:00.000Z", "purpose": "Training", "remarks": null, "createdAt": "2026-06-03T14:17:58.388Z", "startDate": "2026-06-03T16:00:00.000Z", "updatedAt": "2026-06-03T15:43:42.843Z", "approvedAt": "2026-06-03T15:43:42.841Z", "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": "cmplkm5x70000iaeg6ej70tgq", "rejectedById": null, "specialOrderId": "cmpw7i1em03j0ian4gbogbmsw", "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": "cmpy6iuw4009xiaeclgtjdytf", "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 15:43:42.943
cmpy92z3t00aqiaecq7bv3fxt	cmplkm5x70000iaeg6ej70tgq	UPDATE	RoomReservation	cmpy5igz80061iaecxylz0rmu	{"id": "cmpy5igz80061iaecxylz0rmu", "room": {"id": "room_pantry_1", "name": "Pantry 1", "isActive": true, "createdAt": "2026-05-28T13:30:52.976Z", "updatedAt": "2026-05-28T13:30:52.976Z", "isAvailable": true, "unavailableReason": null}, "roomId": "room_pantry_1", "status": "APPROVED", "endDate": "2026-06-04T16:00:00.000Z", "purpose": "Training", "remarks": null, "createdAt": "2026-06-03T14:17:58.388Z", "requester": {"id": "cmpmaayyh0049iausqyybqoai", "slug": "claudevan-a-macabale", "email": "c.macabale.psa@gmail.com", "section": "Philippine Identification System", "fullName": "Claudevan A. Macabale", "isActive": true, "photoUrl": "/uploads/personnel/1780243744525-646.webp", "position": "SG 12 - Information System Analyst I**", "contactNo": "09696018203", "createdAt": "2026-05-26T06:58:52.409Z", "updatedAt": "2026-06-02T10:07:40.577Z", "employeeNo": "PSA1043-021", "archiveDate": null, "archiveReason": null, "travelDetails": null, "travelEndDate": "2026-05-11T16:00:00.000Z", "locationStatus": "on_travel", "travelStartDate": "2026-05-10T16:00:00.000Z", "travelDestination": "El Salvador City, Misamis Oriental"}, "startDate": "2026-06-03T16:00:00.000Z", "updatedAt": "2026-06-03T15:43:42.872Z", "approvedAt": "2026-06-03T15:43:42.841Z", "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": "cmplkm5x70000iaeg6ej70tgq", "rejectedById": null, "specialOrderId": "cmpw7i1em03j0ian4gbogbmsw", "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": "cmpwh4qfg02f7ia40yjrn95k3", "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpy5igz80061iaecxylz0rmu", "roomId": "room_pantry_1", "status": "APPROVED", "endDate": "2026-06-04T16:00:00.000Z", "purpose": "Training", "remarks": null, "createdAt": "2026-06-03T14:17:58.388Z", "startDate": "2026-06-03T16:00:00.000Z", "updatedAt": "2026-06-03T15:57:53.813Z", "approvedAt": "2026-06-03T15:57:53.812Z", "rejectedAt": null, "cancelledAt": null, "halfDaySlot": null, "approvedById": "cmplkm5x70000iaeg6ej70tgq", "rejectedById": null, "specialOrderId": "cmpw7i1em03j0ian4gbogbmsw", "rejectionReason": null, "reservationType": "MULTIPLE_DAYS", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": "cmpwh4qfg02f7ia40yjrn95k3", "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 15:57:53.849
cmpyao80l0006ia20065ot3nh	cmplkm5x70000iaeg6ej70tgq	UPDATE	VehicleRequest	cmpy9rbat00b7iaecdd6xlwz4	{"id": "cmpy9rbat00b7iaecdd6xlwz4", "status": "PENDING", "purpose": "Supervisionaryefewgtrwk;gkrwgk;tkg;2g;2;gdgdegf", "createdAt": "2026-06-03T16:16:49.397Z", "updatedAt": "2026-06-03T16:16:49.397Z", "adminNotes": null, "travelDate": "2026-06-04T16:00:00.000Z", "departureAt": "2026-06-04T22:00:00.000Z", "destination": "Sugbongcogon, Misamis Oriental, Talisayan, Misamis Oriental, Magsaysay, Misamis Oreintal", "reviewedById": null, "specialOrderId": null, "assignedVehicle": null, "rejectionReason": null, "expectedReturnAt": "2026-06-05T09:00:00.000Z", "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpy9rbat00b7iaecdd6xlwz4", "status": "APPROVED", "purpose": "Supervisionaryefewgtrwk;gkrwgk;tkg;2g;2;gdgdegf", "createdAt": "2026-06-03T16:16:49.397Z", "updatedAt": "2026-06-03T16:42:24.741Z", "adminNotes": null, "travelDate": "2026-06-04T16:00:00.000Z", "departureAt": "2026-06-04T22:00:00.000Z", "destination": "Sugbongcogon, Misamis Oriental, Talisayan, Misamis Oriental, Magsaysay, Misamis Oreintal", "reviewedById": "cmplkm5x70000iaeg6ej70tgq", "specialOrderId": null, "rejectionReason": null, "expectedReturnAt": "2026-06-05T09:00:00.000Z", "assignedVehicleId": "cmpoxwo6x0007ia9w60idkoqx", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 16:42:24.79
cmpyaoujx000cia20ljozp6zu	cmpp3gnhz0007iafkfwlwufi4	CREATE	VehicleRequest	cmpyaoujo0008ia20ealxdgtc	\N	{"id": "cmpyaoujo0008ia20ealxdgtc", "status": "PENDING", "purpose": "test", "createdAt": "2026-06-03T16:42:53.988Z", "updatedAt": "2026-06-03T16:42:53.988Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": "2026-06-09T16:42:00.000Z", "destination": "etetetetette", "reviewedById": null, "specialOrderId": null, "rejectionReason": null, "expectedReturnAt": "2026-06-10T00:42:00.000Z", "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 16:42:53.998
cmpyawahb001mia20ng1zlgbs	cmplkm5x70000iaeg6ej70tgq	UPDATE	VehicleRequest	cmpyaoujo0008ia20ealxdgtc	{"id": "cmpyaoujo0008ia20ealxdgtc", "status": "PENDING", "purpose": "test", "createdAt": "2026-06-03T16:42:53.988Z", "updatedAt": "2026-06-03T16:42:53.988Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": "2026-06-09T16:42:00.000Z", "destination": "etetetetette", "reviewedById": null, "specialOrderId": null, "assignedVehicle": null, "rejectionReason": null, "expectedReturnAt": "2026-06-10T00:42:00.000Z", "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpyaoujo0008ia20ealxdgtc", "status": "APPROVED", "purpose": "test", "createdAt": "2026-06-03T16:42:53.988Z", "updatedAt": "2026-06-03T16:48:41.190Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": "2026-06-09T16:42:00.000Z", "destination": "etetetetette", "reviewedById": "cmplkm5x70000iaeg6ej70tgq", "specialOrderId": null, "rejectionReason": null, "expectedReturnAt": "2026-06-10T00:42:00.000Z", "assignedVehicleId": "cmpoxvf6h0004ia9wc2ulotr3", "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 16:48:41.231
cmpyawy4i001sia20v0ak0p5h	cmpp3gnhz0007iafkfwlwufi4	CREATE	VehicleRequest	cmpyawy4b001qia20ts4s8t84	\N	{"id": "cmpyawy4b001qia20ts4s8t84", "status": "PENDING", "purpose": "htrhtr", "createdAt": "2026-06-03T16:49:11.867Z", "updatedAt": "2026-06-03T16:49:11.867Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": "2026-06-09T17:48:00.000Z", "destination": "etetetetette", "reviewedById": null, "specialOrderId": null, "rejectionReason": null, "expectedReturnAt": "2026-06-10T07:48:00.000Z", "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 16:49:11.875
cmpybqyq10011iaukcmfnqij8	cmplkm5x70000iaeg6ej70tgq	UPDATE	VehicleRequest	cmpyawy4b001qia20ts4s8t84	{"id": "cmpyawy4b001qia20ts4s8t84", "status": "PENDING", "purpose": "htrhtr", "createdAt": "2026-06-03T16:49:11.867Z", "updatedAt": "2026-06-03T16:49:11.867Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": "2026-06-09T17:48:00.000Z", "destination": "etetetetette", "reviewedById": null, "specialOrderId": null, "assignedVehicle": null, "rejectionReason": null, "expectedReturnAt": "2026-06-10T07:48:00.000Z", "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	{"id": "cmpyawy4b001qia20ts4s8t84", "status": "REJECTED", "purpose": "htrhtr", "createdAt": "2026-06-03T16:49:11.867Z", "updatedAt": "2026-06-03T17:12:32.293Z", "adminNotes": null, "travelDate": "2026-06-09T16:00:00.000Z", "departureAt": "2026-06-09T17:48:00.000Z", "destination": "etetetetette", "reviewedById": "cmplkm5x70000iaeg6ej70tgq", "specialOrderId": null, "rejectionReason": "wlay sakyanan", "expectedReturnAt": "2026-06-10T07:48:00.000Z", "assignedVehicleId": null, "requestedByUserId": "cmpp3gnhz0007iafkfwlwufi4", "calendarActivityId": null, "requesterPersonnelId": "cmpmaayyh0049iausqyybqoai"}	\N	\N	2026-06-03 17:12:32.329
cmq0bedcr000diaqoo9kwov7s	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmpqdqdfa001xia4wa2udfmxm	\N	{"status": "FINALIZED"}	\N	\N	2026-06-05 02:38:17.115
cmq5hura600nmiamsyene07oz	cmplkm5x70000iaeg6ej70tgq	RESCHEDULE_LAST	ConvocationProgram	cmpqdqdfa001xia4wa2udfmxm	{"convocationDate": "2026-06-07T16:00:00.000Z"}	{"convocationDate": "2026-06-14T16:00:00.000Z"}	\N	\N	2026-06-08 17:37:50.239
cmq7vepzl0001ia5oxlwaf7mn	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-06-10 09:32:49.04
cmq7verps0003ia5ogcnsagny	cmplkm5x70000iaeg6ej70tgq	LOGIN	User	cmplkm5x70000iaeg6ej70tgq	\N	\N	\N	\N	2026-06-10 09:32:51.28
cmq7y09d200hriahcr0sub4u5	cmplkm5x70000iaeg6ej70tgq	CREATE	Project	cmq7y09cq00hpiahcqaix09q0	\N	{"id": "cmq7y09cq00hpiahcqaix09q0", "code": "NMS", "name": "National Migration Survey", "slug": "national-migration-survey-tw9c", "year": 2025, "status": "NO_DEADLINE", "section": null, "category": "STATISTICAL_OPERATIONS", "isActive": true, "priority": "MEDIUM", "uiLayout": "BALANCED", "createdAt": "2026-06-10T10:45:33.146Z", "frequency": "CUSTOM", "updatedAt": "2026-06-10T10:45:33.146Z", "createdById": "cmplkm5x70000iaeg6ej70tgq", "description": "A survey that provides information on the mobility of the Philippine population to help policymakers and program managers design services for people moving within the country or going abroad.", "subcategory": null, "updatedById": "cmplkm5x70000iaeg6ej70tgq", "canvasLayout": null, "workloadWeight": 1, "customFrequency": "Periodic", "showDescription": true, "estimatedMandays": 0, "showResponseRate": true, "customTaskColumns": null, "responseRateLabel": "Response Rate", "showDateSubmitted": true, "dateSubmittedLabel": "Date Submitted", "showOperationWorkload": true, "operationWorkloadLabel": "Project/Operation/Workload", "showDeadlineSubmission": true, "deadlineSubmissionLabel": "Deadline of Submission", "showTotalSamplesDocuments": true, "totalSamplesDocumentsLabel": "Total Sample/Documents"}	\N	\N	2026-06-10 10:45:33.159
cmq87cpdd00cdiab8rkgvphpw	cmplkm5x70000iaeg6ej70tgq	CREATE	Project	cmq87cpd100c9iab8rqhkko1x	\N	{"id": "cmq87cpd100c9iab8rqhkko1x", "code": "CFS", "name": "Commodity Flow Survey", "slug": "commodity-flow-survey-27pr", "year": 2026, "status": "NO_DEADLINE", "section": null, "category": "STATISTICAL_OPERATIONS", "isActive": true, "priority": "MEDIUM", "uiLayout": "BALANCED", "createdAt": "2026-06-10T15:07:10.309Z", "frequency": "QUARTERLY", "updatedAt": "2026-06-10T15:07:10.309Z", "createdById": "cmplkm5x70000iaeg6ej70tgq", "description": null, "subcategory": null, "updatedById": "cmplkm5x70000iaeg6ej70tgq", "canvasLayout": null, "workloadWeight": 1, "customFrequency": null, "showDescription": true, "estimatedMandays": 0, "showResponseRate": true, "customTaskColumns": null, "responseRateLabel": "Response Rate", "showDateSubmitted": true, "dateSubmittedLabel": "Date Submitted", "showOperationWorkload": true, "operationWorkloadLabel": "Project/Operation/Workload", "showDeadlineSubmission": true, "deadlineSubmissionLabel": "Deadline of Submission", "showTotalSamplesDocuments": true, "totalSamplesDocumentsLabel": "Total Sample/Documents"}	\N	\N	2026-06-10 15:07:10.321
cmq99vfzm005miae0ahjjwm1a	cmplkm5x70000iaeg6ej70tgq	HARD_DELETE	Project	cmplkm61m0032iaegn7e1l3jl	{"id": "cmplkm61m0032iaegn7e1l3jl", "code": "PHILSYS", "name": "PHILSYS", "slug": "philsys", "year": 2026, "status": "OVERDUE", "section": "Civil Registration and PHILSYS", "category": "PHILIPPINE_IDENTIFICATION_SYSTEM", "isActive": true, "priority": "HIGH", "uiLayout": "BALANCED", "createdAt": "2026-05-25T18:59:44.795Z", "frequency": "AD_HOC", "updatedAt": "2026-05-30T08:17:16.041Z", "createdById": "cmplkm5x70000iaeg6ej70tgq", "description": "PHILSYS monitoring record for Phase 1 dashboard validation.", "subcategory": null, "updatedById": "cmplkm5x70000iaeg6ej70tgq", "canvasLayout": null, "workloadWeight": 2.4, "customFrequency": null, "showDescription": true, "estimatedMandays": 41, "showResponseRate": true, "customTaskColumns": null, "responseRateLabel": "Response Rate", "showDateSubmitted": true, "dateSubmittedLabel": "Date Submitted", "showOperationWorkload": true, "operationWorkloadLabel": "Project/Operation/Workload", "showDeadlineSubmission": true, "deadlineSubmissionLabel": "Deadline of Submission", "showTotalSamplesDocuments": true, "totalSamplesDocumentsLabel": "Total Samples"}	\N	\N	\N	2026-06-11 09:05:30.035
cmqhv7wbr01pziawoajb87zxz	cmplkm5x70000iaeg6ej70tgq	CREATE	Project	cmqhv7wb001pviawo89gn74fs	\N	{"id": "cmqhv7wb001pviawo89gn74fs", "code": "FUNGAS", "name": "Frame Unit’s National Grid-based Address System", "slug": "frame-unit-s-national-grid-based-address-system-tbfs", "year": 2025, "status": "NO_DEADLINE", "section": null, "category": "STATISTICAL_OPERATIONS", "isActive": true, "priority": "MEDIUM", "uiLayout": "BALANCED", "createdAt": "2026-06-17T09:25:12.395Z", "frequency": "CUSTOM", "updatedAt": "2026-06-17T09:25:12.395Z", "createdById": "cmplkm5x70000iaeg6ej70tgq", "description": null, "subcategory": null, "updatedById": "cmplkm5x70000iaeg6ej70tgq", "canvasLayout": null, "workloadWeight": 1, "customFrequency": "Per Operation / Special Cycle", "showDescription": true, "estimatedMandays": 0, "showResponseRate": true, "customTaskColumns": null, "responseRateLabel": "Response Rate", "showDateSubmitted": true, "dateSubmittedLabel": "Date Submitted", "showOperationWorkload": true, "operationWorkloadLabel": "Project/Operation/Workload", "showDeadlineSubmission": true, "deadlineSubmissionLabel": "Deadline of Submission", "showTotalSamplesDocuments": true, "totalSamplesDocumentsLabel": "Total Sample/Documents"}	\N	\N	2026-06-17 09:25:12.423
cmqnjezuq000yia9gbyma03st	cmplkm5x70000iaeg6ej70tgq	CREATE	ConvocationProgram	cmqnjeztm000lia9ge2bj8bwb	\N	{"id": "cmqnjeztm000lia9ge2bj8bwb", "notes": null, "status": "DRAFT", "groupId": "convocation_group_1", "createdAt": "2026-06-21T08:41:25.210Z", "printedAt": null, "updatedAt": "2026-06-21T08:41:25.210Z", "finalizedAt": null, "finalizedById": null, "generatedById": "cmplkm5x70000iaeg6ej70tgq", "convocationDate": "2026-06-21T16:00:00.000Z", "calendarActivityId": null}	\N	\N	2026-06-21 08:41:25.251
cmqnji2ys0028ia9gsheb101u	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmqnjeztm000lia9ge2bj8bwb	\N	{"status": "FINALIZED"}	\N	\N	2026-06-21 08:43:49.253
cmqtbvosw00a1iagwnvwi77v9	cmplkm5x70000iaeg6ej70tgq	CREATE	ConvocationProgram	cmqtbvors009oiagwjoffk4mq	\N	{"id": "cmqtbvors009oiagwjoffk4mq", "notes": null, "status": "DRAFT", "groupId": "convocation_group_2", "createdAt": "2026-06-25T09:57:04.167Z", "printedAt": null, "updatedAt": "2026-06-25T09:57:04.167Z", "finalizedAt": null, "finalizedById": null, "generatedById": "cmplkm5x70000iaeg6ej70tgq", "convocationDate": "2026-06-28T16:00:00.000Z", "calendarActivityId": null}	\N	\N	2026-06-25 09:57:04.208
cmqtc1stz00cmiagwqejzf7nx	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmqtbvors009oiagwjoffk4mq	\N	{"status": "FINALIZED"}	\N	\N	2026-06-25 10:01:49.367
cmqtc1v8n00csiagws90f7p26	cmplkm5x70000iaeg6ej70tgq	AUTO_REPLACE	ConvocationProgramItem	cmqtbvort009viagw3q207twc	{"rotationKey": "psa_vision_mission_values", "assignmentMode": "ASSIGNABLE", "assignedPersonnelId": "cmpm7z8kc003xiauswx84u6ek"}	{"rotationKey": "psa_vision_mission_values", "assignmentMode": "OVERRIDDEN", "assignedPersonnelId": "cmpm7sv69003oiausjksd398m"}	\N	\N	2026-06-25 10:01:52.487
cmqusuvra001nia7ckbf4ik40	cmplkm5x70000iaeg6ej70tgq	MANUAL_REPLACE_CUSTOM_TEXT	ConvocationProgramItem	cmqtbvors009siagwyci3k415	{"fixedTextValue": "AVP", "assignedPersonnelId": null}	{"fixedTextValue": "MSU-IIT Interns", "assignedPersonnelId": null}	\N	\N	2026-06-26 10:40:06.214
cmqusve2w0021ia7choe0b4jk	cmplkm5x70000iaeg6ej70tgq	MANUAL_REPLACE_CUSTOM_TEXT	ConvocationProgramItem	cmqtbvors009riagwoeiowy1x	{"fixedTextValue": null, "assignedPersonnelId": "cmpm7y2d5003uiaushuvnjj0w"}	{"fixedTextValue": "Aldasir Alih Abud", "assignedPersonnelId": null}	\N	\N	2026-06-26 10:40:29.96
cmqusvvs6002fia7cic4f6erc	cmplkm5x70000iaeg6ej70tgq	MANUAL_REPLACE_CUSTOM_TEXT	ConvocationProgramItem	cmqtbvort009ziagw2cc9l9da	{"fixedTextValue": "Aldasir Alih Abud", "assignedPersonnelId": null}	{"fixedTextValue": "Aldasir Alih Abud", "assignedPersonnelId": null}	\N	\N	2026-06-26 10:40:52.902
cmqut0fp5005nia7cvu8w0mpy	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmqtbvors009oiagwjoffk4mq	\N	{"status": "FINALIZED"}	\N	\N	2026-06-26 10:44:25.337
cmqut50po006xia7cslwp9mh2	cmplkm5x70000iaeg6ej70tgq	MANUAL_REPLACE_PERSONNEL	ConvocationProgramItem	cmqtbvort009wiagwcs1qoxyp	{"fixedTextValue": null, "assignedPersonnelId": "cmpmajetn004iiaus2vel52gz"}	{"fixedTextValue": "Aaron Allen E. Cainglet, SG 11 - Statistical Analyst", "assignedPersonnelId": "cmpm7rduc003iiausmprulwf1"}	\N	\N	2026-06-26 10:47:59.196
cmqut53z10079ia7cr1gx8g9j	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmqtbvors009oiagwjoffk4mq	\N	{"status": "FINALIZED"}	\N	\N	2026-06-26 10:48:03.421
cmqut5a0f007nia7cqj5z8n58	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmqtbvors009oiagwjoffk4mq	\N	{"status": "FINALIZED"}	\N	\N	2026-06-26 10:48:11.247
cmquwi8ty00wwia7cuy6hzpq9	cmplkm5x70000iaeg6ej70tgq	REPLACE_PAGE	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	\N	{"pageNumber": 1}	\N	\N	2026-06-26 12:22:15.094
cmquwiipn00x4ia7clotgjt8g	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-06-26 12:22:27.899
cmquwjchr00xpia7c2amm870n	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 517, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 525, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-06-26 12:23:06.495
cmquwr47o012sia7c6jgl78el	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 525, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 525, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 138, "id": "7e1b0359-572b-4ca5-a8cf-2cfa04358ace", "key": "bagongPilipinas", "wrap": false, "label": "Bagong Pilipinas", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 10, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-06-26 12:29:09.012
cmr0nlmnb00ggiaoc06zylpmf	cmplkm5x70000iaeg6ej70tgq	CREATE	ConvocationProgram	cmr0nlmm500g3iaociu1cnhk2	\N	{"id": "cmr0nlmm500g3iaociu1cnhk2", "notes": null, "status": "DRAFT", "groupId": "convocation_group_3", "createdAt": "2026-06-30T12:59:33.436Z", "printedAt": null, "updatedAt": "2026-06-30T12:59:33.436Z", "finalizedAt": null, "finalizedById": null, "generatedById": "cmplkm5x70000iaeg6ej70tgq", "convocationDate": "2026-07-05T16:00:00.000Z", "calendarActivityId": null}	\N	\N	2026-06-30 12:59:33.479
cmr0nqgk700jmiaocjueq66sv	cmplkm5x70000iaeg6ej70tgq	MANUAL_REPLACE_CUSTOM_TEXT	ConvocationProgramItem	cmr0nlmm600g6iaocd2trf0i2	{"fixedTextValue": null, "assignedPersonnelId": "cmpmalk2l004qiausp3pm1z6f"}	{"fixedTextValue": "Gerry Mae L. Tompong", "assignedPersonnelId": null}	\N	\N	2026-06-30 13:03:18.871
cmr0ntrv900lyiaocgqnf5tgx	cmplkm5x70000iaeg6ej70tgq	MANUAL_REPLACE_PERSONNEL	ConvocationProgramItem	cmr0nlmm600geiaoc7s89hhii	{"fixedTextValue": "Gerry Mae L. Tompong", "assignedPersonnelId": null}	{"fixedTextValue": "Marivic R. Escobido, SG 14 - Registration Officer II", "assignedPersonnelId": "cmpm7nh3s0036iausxm44cu9t"}	\N	\N	2026-06-30 13:05:53.494
cmr0ntuyy00mciaoclox81h6i	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmr0nlmm500g3iaociu1cnhk2	\N	{"status": "FINALIZED"}	\N	\N	2026-06-30 13:05:57.514
cmr0ntvfv00mniaocvj8936y8	cmplkm5x70000iaeg6ej70tgq	FINALIZE	ConvocationProgram	cmr0nlmm500g3iaociu1cnhk2	\N	{"status": "FINALIZED"}	\N	\N	2026-06-30 13:05:58.124
cmr0o4ffs00q3iaoc4g3ies8i	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 525, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 138, "id": "7e1b0359-572b-4ca5-a8cf-2cfa04358ace", "key": "bagongPilipinas", "wrap": false, "label": "Bagong Pilipinas", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 10, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 525, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-06-30 13:14:10.6
cmr0o7j9c00riiaock9ngp5c7	cmplkm5x70000iaeg6ej70tgq	UPDATE_FIELDS	PdfTemplate	cmpqk9iam000dia5sib2j3o3n	{"fields": [{"x": 520.4399999999999, "y": 525, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	{"fields": [{"x": 520.4399999999999, "y": 525, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 12, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	\N	\N	2026-06-30 13:16:35.52
cmr1cduha002fiaqwh6mz0axk	cmplkm5x70000iaeg6ej70tgq	UPDATE_USER	User	cmprp48m1003eiar8xwdzkna0	{"id": "cmprp48m1003eiar8xwdzkna0", "name": "Paula P. Dedumo", "role": "EMPLOYEE", "email": "p.dedumo.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "photoUrl": null, "username": "p.dedumo", "createdAt": "2026-05-30T01:52:23.449Z", "updatedAt": "2026-05-30T01:52:23.449Z", "employeeId": "PSA1043-035", "lastLoginAt": null, "personnelId": "cmpmcwkjj005niausxhpwr0rq", "passwordHash": "$2b$12$F3JQ17v2VbbR7p252o9./.lFcTv4x5If8o0Kkgqbgy1NPbxZgg.cO", "mustChangePassword": true}	{"id": "cmprp48m1003eiar8xwdzkna0", "name": "Paula P. Dedumo", "role": "EMPLOYEE", "email": "pp.dedumo.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "photoUrl": null, "username": "p.dedumo", "createdAt": "2026-05-30T01:52:23.449Z", "updatedAt": "2026-07-01T00:33:20.768Z", "employeeId": "PSA1043-035", "lastLoginAt": null, "personnelId": "cmpmcwkjj005niausxhpwr0rq", "passwordHash": "$2b$12$F3JQ17v2VbbR7p252o9./.lFcTv4x5If8o0Kkgqbgy1NPbxZgg.cO", "mustChangePassword": true}	\N	\N	2026-07-01 00:33:20.783
cmr1ce4cu002oiaqwi6kckxyx	cmplkm5x70000iaeg6ej70tgq	UPDATE_USER	User	cmprp5k9u003uiar8cjpe7aec	{"id": "cmprp5k9u003uiar8cjpe7aec", "name": "Sheila May D. Regular", "role": "EMPLOYEE", "email": "s.regular.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "photoUrl": null, "username": "s.regular", "createdAt": "2026-05-30T01:53:25.219Z", "updatedAt": "2026-05-30T01:53:25.219Z", "employeeId": "PSA1043-039", "lastLoginAt": null, "personnelId": "cmpmd0y8g005ziausnc38ns1g", "passwordHash": "$2b$12$b/S1UHjOqFNSAuWJG1znVOV868gh5mUnR6XD02OwAuXjr0wMylb82", "mustChangePassword": true}	{"id": "cmprp5k9u003uiar8cjpe7aec", "name": "Sheila May D. Regular", "role": "EMPLOYEE", "email": "sh.regular.psa@gmail.com", "section": "Statistical Operations", "isActive": true, "photoUrl": null, "username": "s.regular", "createdAt": "2026-05-30T01:53:25.219Z", "updatedAt": "2026-07-01T00:33:33.575Z", "employeeId": "PSA1043-039", "lastLoginAt": null, "personnelId": "cmpmd0y8g005ziausnc38ns1g", "passwordHash": "$2b$12$b/S1UHjOqFNSAuWJG1znVOV868gh5mUnR6XD02OwAuXjr0wMylb82", "mustChangePassword": true}	\N	\N	2026-07-01 00:33:33.582
cmr1ceqii0034iaqw18ikz3ec	cmplkm5x70000iaeg6ej70tgq	UPDATE_USER	User	cmproy6y8001siar8a50hg49k	{"id": "cmproy6y8001siar8a50hg49k", "name": "Hector B. Paylangco", "role": "VIEWER", "email": null, "section": "Administrative and Accounting", "isActive": true, "photoUrl": null, "username": "h.paylangco", "createdAt": "2026-05-30T01:47:41.360Z", "updatedAt": "2026-05-30T01:47:41.360Z", "employeeId": "PSA1043-027", "lastLoginAt": null, "personnelId": "cmpmamcwq004viaus5y4atq5q", "passwordHash": "$2b$12$ivNMAnhsKs4LxKRZqLbSeOK.uP8rWmjpAyG5fNqL30IH.v8GCA382", "mustChangePassword": true}	{"id": "cmproy6y8001siar8a50hg49k", "name": "Hector B. Paylangco", "role": "VIEWER", "email": "paylangcohector@gmail.com", "section": "Administrative and Accounting", "isActive": true, "photoUrl": null, "username": "h.paylangco", "createdAt": "2026-05-30T01:47:41.360Z", "updatedAt": "2026-07-01T00:34:02.292Z", "employeeId": "PSA1043-027", "lastLoginAt": null, "personnelId": "cmpmamcwq004viaus5y4atq5q", "passwordHash": "$2b$12$ivNMAnhsKs4LxKRZqLbSeOK.uP8rWmjpAyG5fNqL30IH.v8GCA382", "mustChangePassword": true}	\N	\N	2026-07-01 00:34:02.298
\.


--
-- Data for Name: CalendarActivity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CalendarActivity" (id, type, title, "soNumber", "soFileUrl", description, "startDate", "endDate", location, "personnelId", "vehicleName", "createdAt", "updatedAt", "additionalTypes") FROM stdin;
cmpp3p9u1000tiafk8s75f91j	VEHICLE	Vehicle Request: Gingoog City	\N	\N	Vehicle travel request\nRequester: Claudevan A. Macabale\nPurpose: Supervision\nStatus: APPROVED\nVehicle: Isuzu D-Max (SAB-6469)	2026-06-09 16:00:00	2026-06-09 16:00:00	Gingoog City	cmpmaayyh0049iausqyybqoai	Isuzu D-Max (SAB-6469)	2026-05-28 06:17:20.905	2026-05-28 06:17:20.905	{}
cmpwhc10902qvia40u46l30gp	TRAINING	Training for Super Saiyan	SO-2026-800	\N	\N	2026-06-03 00:00:00	2026-06-03 00:00:00	Trainin	\N	\N	2026-06-02 10:13:20.792	2026-06-02 10:13:20.792	{}
cmpy6irde009jiaecqkfxjyd1	ROOM	Room Reservation: Training Room	\N	\N	Room reservation\nRoom: Training Room\nSchedule: Jun 8, 2026\nRequester: Claudevan A. Macabale\nPurpose: test\nStatus: APPROVED	2026-06-07 16:00:00	2026-06-07 16:00:00	Training Room	cmpmaayyh0049iausqyybqoai	\N	2026-06-03 14:46:11.474	2026-06-03 14:46:11.474	{}
cmpp8yus5000uiap4lbw6ascn	EVENT	Convocation Program	\N	\N	Convocation Program\nDate: June 1, 2026\nAssigned group: Group 2\nView the Convocation Program module for the printable assignment.	2026-05-31 16:00:00	2026-05-31 16:00:00	PSA Misamis Oriental	\N	\N	2026-05-28 08:44:46.037	2026-05-29 03:45:14.848	{}
cmq0bedc2000biaqo1aincnay	EVENT	Convocation Program	\N	\N	Convocation Program\nDate: June 8, 2026\nAssigned group: Group 3\nView the Convocation Program module for the printable assignment.\n[Rescheduled from 2026-06-07]	2026-06-14 16:00:00	2026-06-14 16:00:00	PSA Misamis Oriental	\N	\N	2026-06-05 02:38:17.091	2026-06-08 17:37:50.233	{}
cmqnji2x00026ia9go4ipbqet	EVENT	Convocation Program	\N	\N	Convocation Program\nDate: June 22, 2026\nAssigned group: Group 1\nView the Convocation Program module for the printable assignment.	2026-06-21 16:00:00	2026-06-21 16:00:00	PSA Misamis Oriental	\N	\N	2026-06-21 08:43:49.188	2026-06-21 08:43:49.188	{}
cmqtc1stn00ckiagwu7h5sfo6	EVENT	Convocation Program	\N	\N	Convocation Program\nDate: June 29, 2026\nAssigned group: Group 2\nView the Convocation Program module for the printable assignment.	2026-06-28 16:00:00	2026-06-28 16:00:00	PSA Misamis Oriental	\N	\N	2026-06-25 10:01:49.355	2026-06-26 10:48:11.241	{}
cmr0ntuye00maiaocnulsoeel	EVENT	Convocation Program	\N	\N	Convocation Program\nDate: July 6, 2026\nAssigned group: Group 3\nView the Convocation Program module for the printable assignment.	2026-07-05 16:00:00	2026-07-05 16:00:00	PSA Misamis Oriental	\N	\N	2026-06-30 13:05:57.494	2026-06-30 13:05:58.118	{}
cmpwh4mxx01g2ia40vrj7prtz	TRAINING	SO Number: 2026-013	2026-013	\N	Purpose: Conduct February 2026 Labor Force Survey (LFS) 3rd Level Training\n\n	2026-02-05 16:00:00	2026-02-06 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:35.973	2026-06-02 10:32:03.968	{}
cmpwh4nvp01oiia40gvifeh6q	TRAINING	SO Number: 2026-047	2026-047	\N	Purpose: Barangay Civil Registration System Training\n\n	2026-02-18 16:00:00	2026-02-18 16:00:00	Lugait, Misamis Oriental	\N	\N	2026-06-02 10:07:37.19	2026-06-02 10:32:03.971	{TRAVEL}
cmpwh4o4z01qqia40c0qrw4r6	TRAINING	SO Number: 2026-054	2026-054	\N	Purpose: To serve as Resource Speaker in the Training Workshop on CBMS Module 3B: Utilization of CBMS Data in the Comprehensive Development Plan\n\n	2026-02-02 16:00:00	2026-02-02 16:00:00	Chali Beach Resort and Hotel, Cagayan de Oro City	\N	\N	2026-06-02 10:07:37.524	2026-06-02 10:32:03.975	{TRAVEL}
cmpwh4ove01x9ia403512p8mq	TRAINING	SO Number: 2026-081	2026-081	\N	Purpose: To Conduct 2025 FUNGAS Data Processing 3rd Level Training\n\n	2026-03-08 16:00:00	2026-03-09 16:00:00	PSA MIsamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.474	2026-06-02 10:32:03.987	{}
cmpwh4p5t020ria40nwqrqhe9	TRAINING	SO Number: 2026-093	2026-093	\N	Purpose: To Conduct Training on R Programming and Data Management Using Community-Based Monitoring System (CBMS) Data\n\n	2026-03-15 16:00:00	2026-03-19 16:00:00	Pearlmont Hotel, Brgy. 35, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.849	2026-06-02 10:32:04	{TRAVEL}
cmpwh4ppc027oia40i0k9cipu	TRAINING	SO Number: 2026-117	2026-117	\N	Purpose: To Attend the 3rd Level Training of April 2026 Quarterly Labor Force Survey (LFS)\n\n	2026-03-30 16:00:00	2026-03-31 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.553	2026-06-02 10:32:04.006	{}
cmpwh4q5a02caia40lnb2bhcj	TRAINING	SO Number: 2026-138	2026-138	\N	Purpose: Conduct Task Force Training on Retail Price Survey for the Generation of Consumer Price Index\n\n	2026-04-06 16:00:00	2026-04-08 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.126	2026-06-02 10:32:04.014	{}
cmpwh4qj202g5ia40r6964gs1	TRAINING	SO Number: 2026-157	2026-157	\N	Purpose: Conduct the 3rd Level Training on 2025 Household Survey on Domestic Visitor (HSDV)\n\n	2026-04-26 16:00:00	2026-04-30 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.622	2026-06-02 10:32:04.019	{}
cmpwh4qtl02iiia40zekv5q6h	TRAINING	SO Number: 2026-170	2026-170	\N	Purpose: Attend 3rd Level Training of May \n2026 Labor Force Survey\n\n	2026-05-03 16:00:00	2026-05-04 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:41.001	2026-06-02 10:32:04.021	{}
cmpy6it7v009qiaecfadtsznd	ROOM	Room Reservation: Pantry 2	\N	\N	Room reservation\nRoom: Pantry 2\nSchedule: Jun 5, 2026 (Morning)\nRequester: Claudevan A. Macabale\nPurpose: test\nStatus: APPROVED	2026-06-04 16:00:00	2026-06-04 16:00:00	Pantry 2	cmpmaayyh0049iausqyybqoai	\N	2026-06-03 14:46:13.867	2026-06-03 14:46:13.867	{}
cmpwh4qfg02f7ia40yjrn95k3	TRAVEL	SO Number: 2026-152	2026-152	\N	Purpose: Conduct Distribution and Collection of 2025 Annual Survey of Philippine Business and Indsutry and 2025 Survey of Tourism Esteablishment in the Philippines (STEP)\n\n	2026-04-20 16:00:00	2026-07-30 16:00:00	Selected Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:40.493	2026-06-03 15:43:42.86	{ROOM}
cmpyao7zo0001ia20f2sbahs0	VEHICLE	Vehicle Request: Sugbongcogon, Misamis Oriental, Talisayan, Misamis Oriental, Magsaysay, Misamis Oreintal	\N	\N	Vehicle travel request\nRequester: Claudevan A. Macabale\nPurpose: Supervisionaryefewgtrwk;gkrwgk;tkg;2g;2;gdgdegf\nStatus: APPROVED\nVehicle: Isuzu D-Max (SAB-6469)	2026-06-04 22:00:00	2026-06-05 09:00:00	Sugbongcogon, Misamis Oriental, Talisayan, Misamis Oriental, Magsaysay, Misamis Oreintal	cmpmaayyh0049iausqyybqoai	Isuzu D-Max (SAB-6469)	2026-06-03 16:42:24.756	2026-06-03 16:42:24.756	{}
cmpyawagj001hia20k0ecp451	VEHICLE	Vehicle Request: etetetetette	\N	\N	Vehicle travel request\nRequester: Claudevan A. Macabale\nPurpose: test\nStatus: APPROVED\nVehicle: Toyota HiAce (SNA-9905)	2026-06-09 16:42:00	2026-06-10 00:42:00	etetetetette	cmpmaayyh0049iausqyybqoai	Toyota HiAce (SNA-9905)	2026-06-03 16:48:41.203	2026-06-03 16:48:41.203	{}
cmpwh4mla01djia40atwh8mb3	TRAVEL	SO Number: 2026-001	2026-001	\N	Purpose: 2025 QSPBI - 4th Quarter Distrbution of Questionnaires\n\n	2026-01-05 16:00:00	2026-01-05 16:00:00	Tagoloan - Gingoog City, Misamis Oriental	\N	\N	2026-06-02 10:07:35.518	2026-06-02 10:07:35.518	{}
cmpwh4mml01dria40o2rdusgs	TRAVEL	SO Number: 2026-002	2026-002	\N	Purpose: Conduct Local Civil Registry Office (LCRO) Evaluation\n\n	2026-01-06 16:00:00	2026-01-06 16:00:00	Manticao and Lugait, Misamis Oriental	\N	\N	2026-06-02 10:07:35.566	2026-06-02 10:07:35.566	{}
cmpwh4mo401e1ia4067em941s	TRAVEL	SO Number: 2026-003	2026-003	\N	Purpose: Attend an Appointment with City Mayor Cañosa for Proposed LGU Managed Outlet and Conduct Local Civil Registry Office (LCRO) Evaluation\n\n	2026-01-11 16:00:00	2026-01-11 16:00:00	Gingoog City, and Magsaysay, Misamis Orriental	\N	\N	2026-06-02 10:07:35.62	2026-06-02 10:07:35.62	{}
cmpwh4mp201e5ia40n5582fci	TRAVEL	SO Number: 2026-004	2026-004	\N	Purpose: Conduct Fisheries Survey Verification\n\n	2026-01-06 16:00:00	2026-01-08 16:00:00	Balingasag, Talisayan, and Gingoog City, Misammis Oriental	\N	\N	2026-06-02 10:07:35.654	2026-06-02 10:07:35.654	{}
cmpwh4mq801edia40s0h2ays7	TRAVEL	SO Number: 2026-005	2026-005	\N	Purpose: Attend Solemnizing Officer Seminar\n\n	2026-01-13 16:00:00	2026-01-13 16:00:00	Villanueva, Misamis Oriental	\N	\N	2026-06-02 10:07:35.696	2026-06-02 10:07:35.696	{}
cmpwh4mqy01ehia40vfhh9kyj	TRAVEL	SO Number: 2026-006	2026-006	\N	Purpose: Conduct Church Visit and Ocular Inspection\n\n	2026-01-12 16:00:00	2026-01-12 16:00:00	Tagoloan, Misamis Oriental	\N	\N	2026-06-02 10:07:35.723	2026-06-02 10:07:35.723	{}
cmpwh4mrm01elia40k3iareiu	TRAVEL	SO Number: 2026-007	2026-007	\N	Purpose: Conduct Fisheries Survey Supervision\n\n	2026-01-12 16:00:00	2026-01-30 16:00:00	Manticao to Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:35.747	2026-06-02 10:07:35.747	{}
cmpwh4msg01eria40cidbaf5d	TRAVEL	SO Number: 2026-008	2026-008	\N	Purpose: Conduct Courtesy Call to Sample Barangay Landing Centers of Fishery Survey\n\n	2026-01-12 16:00:00	2026-01-15 16:00:00	Manticao to Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:35.777	2026-06-02 10:07:35.777	{}
cmpwh4mt801exia405wfdsnsn	TRAVEL	SO Number: 2026-009	2026-009	\N	Purpose: Conduct January 2026 Labor Force Survey (LFS) and Family Income Expenditure Survey (FIES) Visit Field Supervision\n\n	2026-01-18 16:00:00	2026-01-18 16:00:00	Claveria, Misamis Oriental	\N	\N	2026-06-02 10:07:35.804	2026-06-02 10:07:35.804	{}
cmpwh4mug01f7ia40k8xjt7zh	TRAVEL	SO Number: 2026-010	2026-010	\N	Purpose: Conduct 1st Quarter Consumer Expectations Survey (CES) Field Supervision\n\n	2026-01-22 16:00:00	2026-01-23 16:00:00	Gingoog City, Naawan, Balingasag, and Manticao	\N	\N	2026-06-02 10:07:35.849	2026-06-02 10:07:35.849	{}
cmpwh4mun01f8ia4095uxaeef	TRAVEL	SO Number: 2026-010	2026-010	\N	Purpose: Conduct 1st Quarter Consumer Expectations Survey (CES) Field Supervision\n\n	2026-01-25 16:00:00	2026-01-27 16:00:00	Gingoog City, Naawan, Balingasag, and Manticao	\N	\N	2026-06-02 10:07:35.856	2026-06-02 10:07:35.856	{}
cmpwh4mvd01fcia40om2yn7ze	TRAVEL	SO Number: 2026-011	2026-011	\N	Purpose: Conduct Collection and Coordination for QSPBI and MISSI PPS\n\n	2026-01-14 16:00:00	2026-01-14 16:00:00	Cagayan de Oro City	\N	\N	2026-06-02 10:07:35.881	2026-06-02 10:07:35.881	{}
cmpwh4mwt01foia40vztvjkjv	TRAVEL	SO Number: 2026-012	2026-012	\N	Purpose: Conduct Turnover of the ECRVS Equipment\n\n	2026-01-15 16:00:00	2026-01-15 16:00:00	Cagayan de Oro City	\N	\N	2026-06-02 10:07:35.933	2026-06-02 10:07:35.933	{}
cmpwh4myw01g8ia403flpkrf5	TRAVEL	SO Number: 2026-014	2026-014	\N	Purpose: Conduct Second Pilot Testing on Grid-Based Frame Address System Application to 2025 Labor Force Survey (LFS) and 2025 Family Income Expenditure Survey (FIES) Second Visit Supervision\n\n	2026-02-05 16:00:00	2026-03-14 16:00:00	Balingoan, Gingoog City, Magsaysay, Medina, Talisayan, Claveria, Balingasag, Salay, Sugbongcogon, Kinoguitan, Lagonglong, Tagoloan, Villanueva, Jasaan, Cagayan de Oro City, El Salvador, Opol, Laguindingan, Initao, Naawan, Manticao, and Lugait, Misamis Oriental	\N	\N	2026-06-02 10:07:36.008	2026-06-02 10:07:36.008	{}
cmpwh4mzh01gcia40ihograqh	TRAVEL	SO Number: 2026-015	2026-015	\N	Purpose: Conduct 1st Quarter National ID Field Operation\n\n	2026-01-18 16:00:00	2026-03-30 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:36.029	2026-06-02 10:07:36.029	{}
cmpwh4n0c01gmia40wnfvyz62	TRAVEL	SO Number: 2026-016	2026-016	\N	Purpose: Transport National ID Registration Kits\n\n	2026-01-18 16:00:00	2026-01-18 16:00:00	Opol, Misamis Oriental	\N	\N	2026-06-02 10:07:36.06	2026-06-02 10:07:36.06	{}
cmpwh4n1201gwia40od5wkt48	TRAVEL	SO Number: 2026-017	2026-017	\N	Purpose: Transport National ID Registration Kits\n\n	2026-01-19 16:00:00	2026-01-19 16:00:00	Balingasag, Misamis Oriental	\N	\N	2026-06-02 10:07:36.086	2026-06-02 10:07:36.086	{}
cmpwh4n1p01h0ia403jl1afzv	TRAVEL	SO Number: 2026-018	2026-018	\N	Purpose: Attend KLAREX nga SERBISYO SA BARYO (KSB) "KASALAN NG BAYAN" to Conduct  BRAP Mobile Registration and Awarding of BRAP Beneficiaries\n\n	2026-01-16 16:00:00	2026-01-16 16:00:00	Tagpangi, Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.109	2026-06-02 10:07:36.109	{}
cmpwh4n2a01h4ia401ytqq7zx	TRAVEL	SO Number: 2026-019	2026-019	\N	Purpose: Conduct Distribution of Cheque\n\n	2026-01-18 16:00:00	2026-01-18 16:00:00	Tagoloan, Villanueva, and Jasaan, Misamis Oriental	\N	\N	2026-06-02 10:07:36.13	2026-06-02 10:07:36.13	{}
cmpwh4n3801hcia40utuufvn9	TRAVEL	SO Number: 2026-020	2026-020	\N	Purpose: Conduct Local Civil Registry Office (LCRO) Evaluation and Conduct Church Visit and Ocular Inspection\n\n	2026-01-19 16:00:00	2026-01-19 16:00:00	Lagonglong and Salay, Misamis Oriental	\N	\N	2026-06-02 10:07:36.165	2026-06-02 10:07:36.165	{}
cmpwh4n4n01hoia400gs17oyc	TRAVEL	SO Number: 2026-021	2026-021	\N	Purpose: Attend Solemnizing Officer Seminar\n\n	2026-01-20 16:00:00	2026-01-20 16:00:00	Carmen, Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.216	2026-06-02 10:07:36.216	{}
cmpwh4n5p01hwia40cp0ae83w	TRAVEL	SO Number: 2026-022	2026-022	\N	Purpose: Conduct Local Civil Registry Office (LCRO) Evaluation\n\n	2026-01-22 16:00:00	2026-01-22 16:00:00	Naawan, and Initao, Misamis Oriental	\N	\N	2026-06-02 10:07:36.254	2026-06-02 10:07:36.254	{}
cmpwh4n6i01i0ia40d79bf5vw	TRAVEL	SO Number: 2026-023	2026-023	\N	Purpose: Conduct Church Visit and Ocular Inspection\n\n	2026-01-20 16:00:00	2026-01-20 16:00:00	El Salvador City, Misamis Oriental	\N	\N	2026-06-02 10:07:36.282	2026-06-02 10:07:36.282	{}
cmpwh4n7h01i8ia402gvxleje	TRAVEL	SO Number: 2026-024	2026-024	\N	Purpose: Conduct Local Civil Registry Office (LCRO) Evaluation\n\n	2026-01-21 16:00:00	2026-01-21 16:00:00	Magsaysay and Medina, Misamis Oriental	\N	\N	2026-06-02 10:07:36.317	2026-06-02 10:07:36.317	{}
cmpwh4n8901ieia406hpg7adg	TRAVEL	SO Number: 2026-025	2026-025	\N	Purpose: Conduct National ID Mobile Registration\n\n	2026-01-19 16:00:00	2026-01-19 16:00:00	BJMP Male Dormitory, Lumbia, Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.346	2026-06-02 10:07:36.346	{}
cmpwh4n9m01itia40n5tl201h	TRAVEL	SO Number: 2026-027	2026-027	\N	Purpose: Conduct 4th Quarter QSPBI Data Collection\n\n	2026-01-21 16:00:00	2026-01-22 16:00:00	Gingoog City, Talisayan, Balingoan, Villanueva, Tagoloan, Misamis Oriental, and Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.394	2026-06-02 10:07:36.394	{}
cmpwh4na901ixia404rb8n5x1	TRAVEL	SO Number: 2026-028	2026-028	\N	Purpose: Conduct BRAP Mobile Registration and Awarding of BRAP Beneficiaries\n\n	2026-01-25 16:00:00	2026-01-25 16:00:00	Igpit, Opol, Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.417	2026-06-02 10:07:36.417	{}
cmpwh4nay01j1ia40ih4ccf9j	TRAVEL	SO Number: 2026-029	2026-029	\N	Purpose: Klarex nga Serbisyo sa Baryo (KSB)\n\n	2026-01-23 16:00:00	2026-01-23 16:00:00	Camaman-an, Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.443	2026-06-02 10:07:36.443	{}
cmpwh4nbr01j5ia4020wbnjw1	TRAVEL	SO Number: 2026-29A	2026-29A	\N	Purpose: To Participate in the conduct of Mobile Registration during the KSB\n\n	2026-02-06 16:00:00	2026-02-06 16:00:00	Iponan, Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.471	2026-06-02 10:07:36.471	{}
cmpwh4ncd01j9ia40n2m30unh	TRAVEL	SO Number: 2026-030	2026-030	\N	Purpose: Participate in the Municipal Civic Parade in celebration with the 7th Cantago Festival\n\n	2026-01-30 16:00:00	2026-01-30 16:00:00	Tagoloan, Misamis Oriental	\N	\N	2026-06-02 10:07:36.493	2026-06-02 10:07:36.493	{}
cmpwh4ndp01jtia40logyw0e6	TRAVEL	SO Number: 2026-031	2026-031	\N	Purpose: January 2026 LFS Data Processing 3LT\n\n	2026-01-27 16:00:00	2026-01-27 16:00:00	Pantry 1, PSA MISOR. LKKS CENTER, Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.541	2026-06-02 10:07:36.541	{}
cmpwh4nef01jzia40p26bh4j3	TRAVEL	SO Number: 2026-032	2026-032	\N	Purpose: Weekly CPI Collection for Petroleum and LPG\n\n	2026-01-31 16:00:00	2026-02-27 16:00:00	Gusa, Lapasan, Camaman-an, Carmen and Kauswagan, Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.568	2026-06-02 10:07:36.568	{}
cmpwh4nfi01k7ia40fuk8ipkg	TRAVEL	SO Number: 2026-033	2026-033	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-01-31 16:00:00	2026-02-04 16:00:00	Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.606	2026-06-02 10:07:36.606	{}
cmpwh4nfo01k8ia40oun321tw	TRAVEL	SO Number: 2026-033	2026-033	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-02-14 16:00:00	2026-02-16 16:00:00	Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.612	2026-06-02 10:07:36.612	{}
cmpwh4ngd01keia40kgoe623z	TRAVEL	SO Number: 2026-034	2026-034	\N	Purpose: Collect Foreign Trade Documents\n\n	2026-02-05 16:00:00	2026-02-05 16:00:00	Bugo, Macabalan, Cagayan de Oro City, Tagoloan	\N	\N	2026-06-02 10:07:36.638	2026-06-02 10:07:36.638	{}
cmpwh4nh301kkia409ffr6k0z	TRAVEL	SO Number: 2026-035	2026-035	\N	Purpose: Conduct January 2026 Labor Force Survey (LFS) and 2025 Family Income Expenditure Survey (FIES) Visit 2 Retrieval of Data and Documents\n\n	2026-02-01 16:00:00	2026-02-01 16:00:00	Gingoog City, Medina, Talisayan, Balingoan, Misamis Oriental	\N	\N	2026-06-02 10:07:36.663	2026-06-02 10:07:36.663	{}
cmpwh4nig01kyia40yvvtagh5	TRAVEL	SO Number: 2026-036	2026-036	\N	Purpose: Conduct Roll out of Administrative Petition for Correction Automated System (APCAS)\n\n	2026-02-02 16:00:00	2026-02-04 16:00:00	City Civil Registry Office (CCRO), Cagayan de Oro City	\N	\N	2026-06-02 10:07:36.712	2026-06-02 10:07:36.712	{}
cmpwh4njh01l6ia4017k6cmv7	TRAVEL	SO Number: 2026-037	2026-037	\N	Purpose: Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-02-01 16:00:00	2026-02-01 16:00:00	Libertad and Manticao, Misamis Oriental	\N	\N	2026-06-02 10:07:36.749	2026-06-02 10:07:36.749	{}
cmpwh4nk701laia40wlxdatjx	TRAVEL	SO Number: 2026-038	2026-038	\N	Purpose: WPS COLLECTION\n\n	2026-01-31 16:00:00	2026-02-27 16:00:00	Bulua, Cagayan de Oo City	\N	\N	2026-06-02 10:07:36.776	2026-06-02 10:07:36.776	{}
cmpwh4nlc01lmia402r0tyl93	TRAVEL	SO Number: 2026-039	2026-039	\N	Purpose: WPS COLLECTION\n\n	2026-02-03 16:00:00	2026-02-03 16:00:00	Salay, Misamis Oriental	\N	\N	2026-06-02 10:07:36.816	2026-06-02 10:07:36.816	{}
cmpwh4nmw01m2ia4004u4rj7y	TRAVEL	SO Number: 2026-040	2026-040	\N	Purpose: CSR AND GIVING PSA COM & COLB TO MALE PDL AT LUMBIA BJMP\n\n	2026-02-09 16:00:00	2026-02-09 16:00:00	Lumbia, Cagayan de Oro City, Misamis Oriental	\N	\N	2026-06-02 10:07:36.872	2026-06-02 10:07:36.872	{}
cmpwh4nnp01maia405lra7im0	TRAVEL	SO Number: 2026-041	2026-041	\N	Purpose: Attend Mass Wedding\n\n	2026-02-10 16:00:00	2026-02-10 16:00:00	Gingoog City, Misamis Oriental	\N	\N	2026-06-02 10:07:36.901	2026-06-02 10:07:36.901	{}
cmpwh4noo01mkia40q6prwm10	TRAVEL	SO Number: 2026-042	2026-042	\N	Purpose: Mobile Services (National ID and BRAP)\n\n	2026-02-10 16:00:00	2026-02-10 16:00:00	Salay, Misamis Oriental	\N	\N	2026-06-02 10:07:36.936	2026-06-02 10:07:36.936	{}
cmpwh4npq01msia407rmf1nrw	TRAVEL	SO Number: 2026-043	2026-043	\N	Purpose: Attend Mass Wedding\n\n	2026-02-13 16:00:00	2026-02-13 16:00:00	Manticao, Misamis Oriental	\N	\N	2026-06-02 10:07:36.974	2026-06-02 10:07:36.974	{}
cmpwh4nql01n0ia40prlrxun2	TRAVEL	SO Number: 2026-044	2026-044	\N	Purpose: Attend Mass Wedding\n\n	2026-02-13 16:00:00	2026-02-13 16:00:00	Talisayan, Misamis Oriental	\N	\N	2026-06-02 10:07:37.005	2026-06-02 10:07:37.005	{}
cmpwh4nsj01noia40z2zpzn47	TRAVEL	SO Number: 2026-045	2026-045	\N	Purpose: Social Responsibuility Tree Planting\n\n	2026-02-16 16:00:00	2026-02-16 16:00:00	Claveria, Misamis Oriental	\N	\N	2026-06-02 10:07:37.075	2026-06-02 10:07:37.075	{}
cmpwh4nu301o2ia40z9ybj70d	TRAVEL	SO Number: 2026-046	2026-046	\N	Purpose: Mobile Services (National ID and BRAP)\n\n	2026-02-17 16:00:00	2026-02-17 16:00:00	Salay, Misamis Oriental	\N	\N	2026-06-02 10:07:37.131	2026-06-02 10:07:37.131	{}
cmpwh4nx201owia40cvo2rvig	TRAVEL	SO Number: 2026-048	2026-048	\N	Purpose: Mobile Services (National ID and BRAP)\n\n	2026-02-24 16:00:00	2026-02-24 16:00:00	Salay, Misamis Oriental	\N	\N	2026-06-02 10:07:37.239	2026-06-02 10:07:37.239	{}
cmpwh4nyq01paia40rdf08vid	TRAVEL	SO Number: 2026-049	2026-049	\N	Purpose: Solemnizing Officer Seminar\n\n	2026-02-23 16:00:00	2026-02-23 16:00:00	El Salvador, Misamis Oriental	\N	\N	2026-06-02 10:07:37.299	2026-06-02 10:07:37.299	{}
cmpwh4o1701q2ia40alh5ie6g	TRAVEL	SO Number: 2026-050	2026-050	\N	Purpose: Conduct 36th CRM Culmination Activities\n\n	2026-02-26 16:00:00	2026-02-26 16:00:00	El Salvador, Misamis Oriental	\N	\N	2026-06-02 10:07:37.388	2026-06-02 10:07:37.388	{}
cmpwh4o1z01q6ia40u32xnakq	TRAVEL	SO Number: 2026-051	2026-051	\N	Purpose: SUPERVISION FOR MONTHLY PALAY & CORN MONITORING SYSTEM, RICE AND CORN STOCKS SURVEY CPI\n\n	2026-01-31 16:00:00	2026-02-12 16:00:00	Cagayan de Oro City to Gingoog City	\N	\N	2026-06-02 10:07:37.415	2026-06-02 10:07:37.415	{}
cmpwh4o3y01qkia40zyxlsacq	TRAVEL	SO Number: 2026-053	2026-053	\N	Purpose: February 2026 Labor Force Survey (LFS) Supervision\n\n	2026-02-07 16:00:00	2026-02-27 16:00:00	Balingasag, Magsaysay, City of Gingoog, Naawan, Tagoloan, Mis. Or, and CDOC	\N	\N	2026-06-02 10:07:37.487	2026-06-02 10:07:37.487	{}
cmpwh4o5u01quia40l9h9z4ft	TRAVEL	SO Number: 2026-055	2026-055	\N	Purpose: Fisheries Survey Supervision\n\n	2026-02-02 16:00:00	2026-02-27 16:00:00	Manticao and Magsaysay	\N	\N	2026-06-02 10:07:37.554	2026-06-02 10:07:37.554	{}
cmpwh4o7001r2ia40pgdanlnv	TRAVEL	SO Number: 2026-056	2026-056	\N	Purpose: Attend the Civil Registration Stakeholders' Appreciation Day\n\n	2026-02-08 16:00:00	2026-02-08 16:00:00	El Salvador, Misamis Oriental	\N	\N	2026-06-02 10:07:37.597	2026-06-02 10:07:37.597	{}
cmpwh4o7p01r6ia40v95gbmnz	TRAVEL	SO Number: 2026-057	2026-057	\N	Purpose: Conduct Second Pilot Test on Grid-Based Frame Address System Application to 2025 Labor Force Survey and the July 2025 Family Income and Expenditiure Survey Second Visit Briefing\n\n	2026-02-08 16:00:00	2026-02-08 16:00:00	Pearlmont Hotel, Cagayan de Oro City	\N	\N	2026-06-02 10:07:37.621	2026-06-02 10:07:37.621	{}
cmpwh4o8c01rcia40iw77nf28	EVENT	SO Number: 2026-058	2026-058	\N	Purpose: Attend the Single Parents Association - Learning Session on Labor Laws for the Corporate social Responsibility - March 2026\n\n	2026-03-07 16:00:00	2026-03-07 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:37.644	2026-06-02 10:07:37.644	{}
cmpwh4o9801rkia40d69n2y71	TRAVEL	SO Number: 2026-059	2026-059	\N	Purpose: To conduct Church Visit and Ocular Inspection and Distribution of Cheque\n\n	2026-02-17 16:00:00	2026-02-17 16:00:00	Kinoguitan, Binuangan, and Jasaan, Misamis Oriental	\N	\N	2026-06-02 10:07:37.677	2026-06-02 10:07:37.677	{}
cmpwh4ocg01rsia40lisbrivl	TRAVEL	SO Number: 2026-060	2026-060	\N	Purpose: To Attend the City Council Meeting on the Boundary Dispute of Barangays\n\n	2026-02-12 16:00:00	2026-02-12 16:00:00	City Hall, Cagayan de Oro City	\N	\N	2026-06-02 10:07:37.792	2026-06-02 10:07:37.792	{}
cmpwh4odf01ryia407ww6mhlx	TRAVEL	SO Number: 2026-061	2026-061	\N	Purpose: To Attend the Philippine Association of Building Officials (PABO) CDO-Mis. Or Monthly Covening\n\n	2026-02-19 16:00:00	2026-02-19 16:00:00	Kinoguitan and Balingoan, Misamis Oriental	\N	\N	2026-06-02 10:07:37.827	2026-06-02 10:07:37.827	{}
cmpwh4oek01saia400uxb5pwk	TRAVEL	SO Number: 2026-062	2026-062	\N	Purpose: Attend Mass Wedding\n\n	2026-02-12 16:00:00	2026-02-12 16:00:00	City Jail, Lumbia, Cagayan de Oro City, Misamis Oriental	\N	\N	2026-06-02 10:07:37.868	2026-06-02 10:07:37.868	{}
cmpwh4qse02i8ia40se8s4mkn	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-24 16:00:00	2026-05-24 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.958	2026-06-02 10:07:40.958	{}
cmpwh4o3401qeia40phd7zw5w	TRAINING	SO Number: 2026-052	2026-052	\N	Purpose: Coordination Meeting for the basic Statistics Training\n\n	2026-02-09 16:00:00	2026-02-09 16:00:00	MSU - Naawan	\N	\N	2026-06-02 10:07:37.456	2026-06-02 10:32:03.973	{TRAVEL}
cmpwh4oh101suia40djnr6rxb	TRAINING	SO Number: 2026-065	2026-065	\N	Purpose: To conduct Community-Based  Monitoring System (CBMS) Training on Basic Statistics for Local Government Units\n\n	2026-02-17 16:00:00	2026-02-19 16:00:00	Pearlmont Hotel, Brgy. 35, Cagayan de Oro City	\N	\N	2026-06-02 10:07:37.958	2026-06-02 10:32:03.978	{TRAVEL}
cmpwh4or901v9ia400vhusrdl	TRAINING	SO Number: 2026-077	2026-077	\N	Purpose: To Conduct MISSI and PPS Provincial Level Training\n\n	2026-02-24 16:00:00	2026-02-24 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.325	2026-06-02 10:32:03.98	{}
cmpwh4ou601wnia405xhc1rt4	TRAINING	SO Number: 2026-080	2026-080	\N	Purpose: To Conduct 2025 FIES Visit 2 Data Processing 3rd Level Training\n\n	2026-02-25 16:00:00	2026-02-26 16:00:00	PSA MIsamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.43	2026-06-02 10:32:03.983	{}
cmpwh4ofh01siia408xz5aw6a	TRAVEL	SO Number: 2026-063	2026-063	\N	Purpose: To Participate in the conduct of Mobile Regitration and Implementation of BRAP\n\n	2026-02-12 16:00:00	2026-02-12 16:00:00	Covered Court, Barangay San Francisco De Asis, City of El Salvador, Misamis Oriental	\N	\N	2026-06-02 10:07:37.901	2026-06-02 10:07:37.901	{}
cmpwh4oge01sqia400mkj0ezw	TRAVEL	SO Number: 2026-064	2026-064	\N	Purpose: To Participate in the conduct of Mobile Regitration and Implementation of BRAP during the KSB "Klarex nga Serbisyo sa Baryo"\n\n	2026-02-13 16:00:00	2026-02-13 16:00:00	Barangay Macabalan, Cagayan de Oro City	\N	\N	2026-06-02 10:07:37.934	2026-06-02 10:07:37.934	{}
cmpwh4ohs01t0ia40vg001v2l	TRAVEL	SO Number: 2026-066	2026-066	\N	Purpose: To Conduct National ID Mobile Registration\n\n	2026-02-15 16:00:00	2026-02-15 16:00:00	Lagonglong, Misamis Oriental	\N	\N	2026-06-02 10:07:37.985	2026-06-02 10:07:37.985	{}
cmpwh4oiu01t8ia40zb7pdh2h	TRAVEL	SO Number: 2026-067	2026-067	\N	Purpose: To Conduct 2024 CBMS Data Presentation\n\n	2026-02-19 16:00:00	2026-02-19 16:00:00	Gingoog City, Misamis Oriental	\N	\N	2026-06-02 10:07:38.023	2026-06-02 10:07:38.023	{}
cmpwh4ojo01teia40j03rg1vk	TRAVEL	SO Number: 2026-068	2026-068	\N	Purpose: To Distribute Cheque for the 2024 POPCEN-CBMS Honorarium of Barangay Captains\n\n	2026-02-17 16:00:00	2026-02-17 16:00:00	Opol and El Salvador City, Misamis Oriental	\N	\N	2026-06-02 10:07:38.052	2026-06-02 10:07:38.052	{}
cmpwh4okh01tkia405uo3wrye	TRAVEL	SO Number: 2026-069	2026-069	\N	Purpose: To Distribute Letter for the COnduct of the 36th Civil Registration Month Culminating Activities\n\n	2026-02-17 16:00:00	2026-02-17 16:00:00	El Salvador City, Misamis Oriental	\N	\N	2026-06-02 10:07:38.081	2026-06-02 10:07:38.081	{}
cmpwh4ols01twia40c9o5vsbi	TRAVEL	SO Number: 2026-070	2026-070	\N	Purpose: To Conduct Port Visitation for the Domestic Trade Statistics and Collection of Building Permits\n\n	2026-02-22 16:00:00	2026-02-23 16:00:00	Tagoloan, Gingoog City, Opol, Lugait, Misamis Oriental	\N	\N	2026-06-02 10:07:38.128	2026-06-02 10:07:38.128	{}
cmpwh4omk01u2ia40lgaxsmfs	TRAVEL	SO Number: 2026-071	2026-071	\N	Purpose: To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-02-17 16:00:00	2026-02-17 16:00:00	El Salvador City, Misamis Oriental	\N	\N	2026-06-02 10:07:38.156	2026-06-02 10:07:38.156	{}
cmpwh4ona01u8ia4073rumvpc	TRAVEL	SO Number: 2026-072	2026-072	\N	Purpose: To Conduct 2025 ULAFO LMLFC Field Verification\n\n	2026-02-23 16:00:00	2026-02-23 16:00:00	Besigan, Tagpangi, Bayanga, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.182	2026-06-02 10:07:38.182	{}
cmpwh4ood01ukia40ovh6ipy4	TRAVEL	SO Number: 2026-073	2026-073	\N	Purpose: To Attend KLAREX nga SERBISYO SA BARYO (KSB) "Kasalan sa Baryo" and To Conduct PhilSys and BRAP Mobile Registration and Awarading of BRAP Beneficiaries\n\n	2026-02-20 16:00:00	2026-02-20 16:00:00	San Simon, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.221	2026-06-02 10:07:38.221	{}
cmpwh4op701usia40jage9r2s	TRAVEL	SO Number: 2026-074	2026-074	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-02-28 16:00:00	2026-03-04 16:00:00	Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.251	2026-06-02 10:07:38.251	{}
cmpwh4opf01utia40p4tydq82	TRAVEL	SO Number: 2026-074	2026-074	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-03-14 16:00:00	2026-03-16 16:00:00	Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.259	2026-06-02 10:07:38.259	{}
cmpwh4oq401uzia401ohihwqm	TRAVEL	SO Number: 2026-075	2026-075	\N	Purpose: Weekly CPI Collection for Petroleum and LPG\n\n	2026-02-28 16:00:00	2026-03-30 16:00:00	Gusa, Lapasan, Camaman-an, Carmen and Kauswagan, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.285	2026-06-02 10:07:38.285	{}
cmpwh4oqr01v5ia40nvsx8jf1	TRAVEL	SO Number: 2026-076	2026-076	\N	Purpose: To Collect Foreign Trade Documents\n\n	2026-03-03 16:00:00	2026-03-05 16:00:00	Bugo and Macabalan, Cagayan de Oro City and Tagoloan, Misamis Oriental	\N	\N	2026-06-02 10:07:38.308	2026-06-02 10:07:38.308	{}
cmpwh4os101vhia40h1m88pcx	TRAVEL	SO Number: 2026-078	2026-078	\N	Purpose: To Conduct Ocular Visit at Local Civil registry Office (LCRO)\n\n	2026-02-24 16:00:00	2026-02-24 16:00:00	Talisayan, Misamis Oriental	\N	\N	2026-06-02 10:07:38.354	2026-06-02 10:07:38.354	{}
cmpwh4osq01vnia40fq5q3ble	TRAVEL	SO Number: 2026-079	2026-079	\N	Purpose: To Conduct 2026 MISSI and PPS Coordination and Distribution of Tokens\n\n	2026-02-25 16:00:00	2026-02-26 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:38.379	2026-06-02 10:07:38.379	{}
cmpwh4qsj02i9ia40ao2tdql8	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-26 16:00:00	2026-05-26 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.963	2026-06-02 10:07:40.963	{}
cmpwh4ox001xxia40mzax7om4	TRAVEL	SO Number: 2026-083	2026-083	\N	Purpose: To Attend KLAREX nga SERBISYO SA BARYO (KSB) "Kasalan sa Baryo" and To Conduct PhilSys and BRAP Mobile Registration and Awarading of BRAP Beneficiaries\n\n	2026-02-27 16:00:00	2026-02-27 16:00:00	Nazareth, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.533	2026-06-02 10:07:38.533	{}
cmpwh4oxj01y1ia40j9a0s1y7	TRAVEL	SO Number: 2026-084	2026-084	\N	Purpose: To Conduct Fisheries Survey Supervision, Field Verification and Spot Checking\n\n	2026-03-02 16:00:00	2026-03-30 16:00:00	Manticao to Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:38.551	2026-06-02 10:07:38.551	{}
cmpwh4oy201y5ia4054x1djvu	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-03 16:00:00	2026-03-03 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.571	2026-06-02 10:07:38.571	{}
cmpwh4oy701y6ia40te7rse8l	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-05 16:00:00	2026-03-05 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.575	2026-06-02 10:07:38.575	{}
cmpwh4oyb01y7ia40rbaafll8	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-08 16:00:00	2026-03-08 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.579	2026-06-02 10:07:38.579	{}
cmpwh4oyf01y8ia40gwoe5a25	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-10 16:00:00	2026-03-10 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.583	2026-06-02 10:07:38.583	{}
cmpwh4oyj01y9ia40nizv97dk	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-12 16:00:00	2026-03-12 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.588	2026-06-02 10:07:38.588	{}
cmpwh4oyo01yaia40we4oxlby	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-15 16:00:00	2026-03-15 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.592	2026-06-02 10:07:38.592	{}
cmpwh4oys01ybia40hn8fwk97	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-17 16:00:00	2026-03-17 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.596	2026-06-02 10:07:38.596	{}
cmpwh4oyy01ycia40fc6m4huc	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-19 16:00:00	2026-03-19 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.602	2026-06-02 10:07:38.602	{}
cmpwh4oz301ydia40fob3ro0a	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-22 16:00:00	2026-03-22 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.607	2026-06-02 10:07:38.607	{}
cmpwh4oz801yeia408s623phx	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-24 16:00:00	2026-03-24 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.612	2026-06-02 10:07:38.612	{}
cmpwh4ozc01yfia403kqlil38	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-26 16:00:00	2026-03-26 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.616	2026-06-02 10:07:38.616	{}
cmpwh4ozg01ygia40zjc9asxu	TRAVEL	SO Number: 2026-085	2026-085	\N	Purpose: To Collect WPS\n\n	2026-03-29 16:00:00	2026-03-29 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.62	2026-06-02 10:07:38.62	{}
cmpwh4ozx01ykia40jw7u56gb	TRAVEL	SO Number: 2026-086	2026-086	\N	Purpose: To Conduct Field Supervision for Monthly Palay and Corn Monitoring System, Rice and Corn Stock Survey and Retail Price Survey\n\n	2026-02-28 16:00:00	2026-03-12 16:00:00	Cagayan de Oro City to Lugait, Misamis Oriental	\N	\N	2026-06-02 10:07:38.638	2026-06-02 10:07:38.638	{}
cmpwh4p0k01yqia404ti8xil7	TRAVEL	SO Number: 2026-087	2026-087	\N	Purpose: To Conduct Coordination for Serbisyo Para Kai Juana in Celebration of the 2026 National Women's Month\n\n	2026-03-02 16:00:00	2026-03-02 16:00:00	Alubijid, Misamis Oriental	\N	\N	2026-06-02 10:07:38.66	2026-06-02 10:07:38.66	{}
cmpwh4p0o01yria40b1t78ycf	TRAVEL	SO Number: 2026-087	2026-087	\N	Purpose: To Conduct Coordination for Serbisyo Para Kai Juana in Celebration of the 2026 National Women's Month\n\n	2026-03-05 16:00:00	2026-03-05 16:00:00	Alubijid, Misamis Oriental	\N	\N	2026-06-02 10:07:38.665	2026-06-02 10:07:38.665	{}
cmpwh4p1d01yzia40rqdx29yd	TRAVEL	SO Number: 2026-088	2026-088	\N	Purpose: To Participate in the conduct of Mobile Regitration and Implementation of BRAP\n\n	2026-03-02 16:00:00	2026-03-02 16:00:00	Xavier University - Ateneo de Cagayan	\N	\N	2026-06-02 10:07:38.69	2026-06-02 10:07:38.69	{}
cmpwh4p1h01z0ia408xrs606p	TRAVEL	SO Number: 2026-088	2026-088	\N	Purpose: To Participate in the conduct of Mobile Regitration and Implementation of BRAP\n\n	2026-03-05 16:00:00	2026-03-05 16:00:00	Xavier University - Ateneo de Cagayan	\N	\N	2026-06-02 10:07:38.694	2026-06-02 10:07:38.694	{}
cmpwh4p2801zcia40n9z8s5qb	TRAVEL	SO Number: 2026-089	2026-089	\N	Purpose: To Conduct CFS Distribution,CPI Spotcheck, BP Follow Up\n\n	2026-03-15 16:00:00	2026-03-16 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:38.72	2026-06-02 10:07:38.72	{}
cmpwh4p2c01zdia40847ue70z	TRAVEL	SO Number: 2026-089	2026-089	\N	Purpose: To Conduct CFS Distribution,CPI Spotcheck, BP Follow Up\n\n	2026-03-18 16:00:00	2026-03-19 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:38.724	2026-06-02 10:07:38.724	{}
cmpwh4p2r01zhia4037zyz8qe	EVENT	SO Number: 2026-090	2026-090	\N	Purpose: To Attend National Women's Month 2026 Kick-Off Ceremony  Re-echo on Cybersecurity\n\n	2026-03-03 16:00:00	2026-03-03 16:00:00	PSA MIsamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.74	2026-06-02 10:07:38.74	{}
cmpwh4p3h01zpia40wg2be8gg	TRAVEL	SO Number: 2026-091	2026-091	\N	Purpose: To Pick-up Airways Manifests for Domestic Trade Statistics\n\n	2026-03-08 16:00:00	2026-03-08 16:00:00	Laguindingan, Misamis Oriental	\N	\N	2026-06-02 10:07:38.765	2026-06-02 10:07:38.765	{}
cmpwh4p6i0211ia40x6c6alkm	TRAVEL	SO Number: 2026-094	2026-094	\N	Purpose: KSB and Special Registration (NID)\n\n	2026-03-06 16:00:00	2026-03-06 16:00:00	Bayanga, Mambuaya, & Tagoloan, Misamis Oriental	\N	\N	2026-06-02 10:07:38.874	2026-06-02 10:07:38.874	{}
cmpwh4p760217ia403nd2ikwv	TRAVEL	SO Number: 2026-095	2026-095	\N	Purpose: MARCH 2026 LFS Field Supervision\n\n	2026-03-07 16:00:00	2026-03-30 16:00:00	Alubijid, El Salvador City, Manticao, Talisayan. Gingoog City and Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.899	2026-06-02 10:07:38.899	{}
cmpwh4p7z021fia40e5tg2t1a	TRAVEL	SO Number: 2026-096	2026-096	\N	Purpose: To Conduct LRCO Evaluation and Church Visit\n\n	2026-03-15 16:00:00	2026-03-15 16:00:00	Binuangan, Misamis Oriental	\N	\N	2026-06-02 10:07:38.928	2026-06-02 10:07:38.928	{}
cmpwh4p8t021nia40rnaanit0	TRAVEL	SO Number: 2026-097	2026-097	\N	Purpose: To Conduct Local Civil Registry Office (LRCO) Evaluation\n\n	2026-03-23 16:00:00	2026-03-23 16:00:00	Laguindingan and Gitagum, Misamis Oriental	\N	\N	2026-06-02 10:07:38.958	2026-06-02 10:07:38.958	{}
cmpwh4pb3022xia40i38gx3vx	TRAVEL	SO Number: 2026-099	2026-099	\N	Purpose: To Conduct Other Crops Enumeration\n\n	2026-03-15 16:00:00	2026-03-30 16:00:00	Selected Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:39.039	2026-06-02 10:07:39.039	{}
cmpwh4ow401xlia40ffnt76tk	TRAINING	SO Number: 2026-082	2026-082	\N	Purpose: To Conduct March 2026 LFS 3rd Level Training\n\n	2026-03-05 16:00:00	2026-03-05 16:00:00	PSA MIsamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.501	2026-06-02 10:32:03.992	{}
cmpwh4p4i020bia405g953ztg	TRAINING	SO Number: 2026-092	2026-092	\N	Purpose: To Attend the 3rd Level Fisheries Training\n\n	2026-03-04 16:00:00	2026-03-04 16:00:00	PSA MIsamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:38.802	2026-06-02 10:32:03.997	{}
cmpwh4p9z022dia4058snjufo	TRAINING	SO Number: 2026-098	2026-098	\N	Purpose: To Attend the 3rd Level Training on Other Crops Survey\n\n	2026-03-08 16:00:00	2026-03-09 16:00:00	PSA MIsamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39	2026-06-02 10:32:04.003	{}
cmpwh4pbo0231ia4085mux3dw	TRAVEL	SO Number: 2026-100	2026-100	\N	Purpose: To Conduct Other Crops Field Supervision\n\n	2026-03-15 16:00:00	2026-04-10 16:00:00	Selected Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:39.06	2026-06-02 10:07:39.06	{}
cmpwh4pcc0239ia40q2rl2lhe	TRAVEL	SO Number: 2026-101	2026-101	\N	Purpose: To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-03-09 16:00:00	2026-03-09 16:00:00	Lugait, Misamis Oriental	\N	\N	2026-06-02 10:07:39.084	2026-06-02 10:07:39.084	{}
cmpwh4pd9023jia406u8jzhb2	TRAVEL	SO Number: 2026-102	2026-102	\N	Purpose: To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-03-10 16:00:00	2026-03-10 16:00:00	F.S Catanico, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.117	2026-06-02 10:07:39.117	{}
cmpwh4pe0023ria40iyabpzvz	TRAVEL	SO Number: 2026-103	2026-103	\N	Purpose: To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-03-11 16:00:00	2026-03-11 16:00:00	Kalabaylabay, El Salvador City	\N	\N	2026-06-02 10:07:39.145	2026-06-02 10:07:39.145	{}
cmpwh4peu0243ia406eau36le	TRAVEL	SO Number: 2026-104	2026-104	\N	Purpose: To Conduct Philsys and PBRAP Mobile Registraton and Awarding of BRAP Beneficiaries\n\n	2026-03-13 16:00:00	2026-03-13 16:00:00	Lapasan, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.174	2026-06-02 10:07:39.174	{}
cmpwh4pfg024bia40sbjgr46l	TRAVEL	SO Number: 2026-105	2026-105	\N	Purpose: To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-03-15 16:00:00	2026-03-15 16:00:00	BJMP Female Dormitory, Lumbia, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.197	2026-06-02 10:07:39.197	{}
cmpwh4pg4024jia40qso3ceg1	TRAVEL	SO Number: 2026-106	2026-106	\N	Purpose: To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-03-16 16:00:00	2026-03-17 16:00:00	Minalwang, Claveria, Misamis Oriental	\N	\N	2026-06-02 10:07:39.221	2026-06-02 10:07:39.221	{}
cmpwh4pgw024pia400axsyvav	TRAVEL	SO Number: 2026-107	2026-107	\N	Purpose: To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-03-10 16:00:00	2026-03-10 16:00:00	Suarez, Kinoguitan, Misamis Oriental	\N	\N	2026-06-02 10:07:39.249	2026-06-02 10:07:39.249	{}
cmpwh4phq024via407duho4m5	TRAVEL	SO Number: 2026-108	2026-108	\N	Purpose: To Conduct Philsys and PBRAP Mobile Registraton and Awarding of BRAP Beneficiaries\n\n	2026-03-20 16:00:00	2026-03-20 16:00:00	Canitoan, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.278	2026-06-02 10:07:39.278	{}
cmpwh4pib0251ia40o4hwuges	TRAVEL	SO Number: 2026-109	2026-109	\N	Purpose: To Conducrt Church Visit and Ocular Inspection\n\n	2026-03-11 16:00:00	2026-03-11 16:00:00	Tagpangi, Cagayan de Oro City and Tingalan, Opol, Misamis Oriental	\N	\N	2026-06-02 10:07:39.3	2026-06-02 10:07:39.3	{}
cmpwh4pj00257ia406qpb6vqm	TRAVEL	SO Number: 2026-110	2026-110	\N	Purpose: To Conduct 2026 MISSI and PPS Coordination and Distribution of Forms\n\n	2026-03-16 16:00:00	2026-03-16 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:39.324	2026-06-02 10:07:39.324	{}
cmpwh4pj50258ia404bse55xq	TRAVEL	SO Number: 2026-110	2026-110	\N	Purpose: To Conduct 2026 MISSI and PPS Coordination and Distribution of Forms\n\n	2026-03-18 16:00:00	2026-03-18 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:39.33	2026-06-02 10:07:39.33	{}
cmpwh4pko025qia4004kg8d1d	TRAVEL	SO Number: 2026-111	2026-111	\N	Purpose: To Conduct "Serbisyo Para Kai Juana in Celebration of the 2026 National Women's Month\n\n	2026-03-17 16:00:00	2026-03-17 16:00:00	Tula, Alubijid, Misamis Oriental	\N	\N	2026-06-02 10:07:39.384	2026-06-02 10:07:39.384	{}
cmpwh4plg025yia40d1bep95v	TRAVEL	SO Number: 2026-112	2026-112	\N	Purpose: To Conduct Distribution of Record-Keeping of Harvest from Aquafarms\n\n	2026-03-24 16:00:00	2026-03-25 16:00:00	Manticao to Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:39.413	2026-06-02 10:07:39.413	{}
cmpwh4pm70266ia40bzsy302t	TRAVEL	SO Number: 2026-113	2026-113	\N	Purpose: To Conduct LOcal Civil Registry Office (LRCO) Evaluation\n\n	2026-03-30 16:00:00	2026-03-30 16:00:00	Kinoguitan and Balingoan, Misamis Oriental	\N	\N	2026-06-02 10:07:39.439	2026-06-02 10:07:39.439	{}
cmpwh4pms026eia40wf4lgip1	TRAVEL	SO Number: 2026-114	2026-114	\N	Purpose: To Conduct National ID Special Registration\n\n	2026-03-20 16:00:00	2026-03-20 16:00:00	Within Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.46	2026-06-02 10:07:39.46	{}
cmpwh4pni026mia4001ls23yo	TRAVEL	SO Number: 2026-115	2026-115	\N	Purpose: To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-03-25 16:00:00	2026-03-25 16:00:00	Bolisong, El Salvador City, Misamis Oriental	\N	\N	2026-06-02 10:07:39.487	2026-06-02 10:07:39.487	{}
cmpwh4po0026qia40zil4zsvb	TRAVEL	SO Number: 2026-116	2026-116	\N	Purpose: To Conduct National ID Mobile Registration\n\n	2026-03-22 16:00:00	2026-03-22 16:00:00	Commission on Audit, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.504	2026-06-02 10:07:39.504	{}
cmpwh4pr7028dia40gw3be9fu	TRAVEL	SO Number: 2026-118	2026-118	\N	Purpose: To Conduct 2026 QSPBI 1st Quarter Distribution of Questionnaires\n\n	2026-03-22 16:00:00	2026-03-30 16:00:00	Selected Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:39.62	2026-06-02 10:07:39.62	{}
cmpwh4psx0293ia40o1kkx51x	TRAVEL	SO Number: 2026-120	2026-120	\N	Purpose: To Conducrt Field Supervision for Monthly Palay and Corn Monitoring System, Rice and Corn Stocks Survey and Retail Proce Survey\n\n	2026-03-31 16:00:00	2026-04-14 16:00:00	Cagayan de Oro City to Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:39.682	2026-06-02 10:07:39.682	{}
cmpwh4ptn029bia403wukdmd4	TRAVEL	SO Number: 2026-121	2026-121	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-03-29 16:00:00	2026-03-30 16:00:00	Cagyan de Oro City	\N	\N	2026-06-02 10:07:39.707	2026-06-02 10:07:39.707	{}
cmpwh4pts029cia407g0z447t	TRAVEL	SO Number: 2026-121	2026-121	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-03-31 16:00:00	2026-03-31 16:00:00	Cagyan de Oro City	\N	\N	2026-06-02 10:07:39.712	2026-06-02 10:07:39.712	{}
cmpwh4ptw029dia40txhbd4mt	TRAVEL	SO Number: 2026-121	2026-121	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-04-03 16:00:00	2026-04-05 16:00:00	Cagyan de Oro City	\N	\N	2026-06-02 10:07:39.716	2026-06-02 10:07:39.716	{}
cmpwh4pu0029eia40oy6kmluv	TRAVEL	SO Number: 2026-121	2026-121	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-04-14 16:00:00	2026-04-16 16:00:00	Cagyan de Oro City	\N	\N	2026-06-02 10:07:39.72	2026-06-02 10:07:39.72	{}
cmpwh4pun029mia40rpjaw7iu	TRAVEL	SO Number: 2026-122	2026-122	\N	Purpose: Weekly CPI Collection for Petroleum and LPG\n\n	2026-03-31 16:00:00	2026-04-29 16:00:00	Gusa, Lapasan, Camaman-an, Carmen and Kauswagan, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.743	2026-06-02 10:07:39.743	{}
cmpwh4pv7029sia40cnirileg	TRAVEL	SO Number: 2026-123	2026-123	\N	Purpose: To Collect Foreign Trade Documents\n\n	2026-04-05 16:00:00	2026-04-05 16:00:00	Bugo and Macabalan, Cagayan de Oro City and Tagoloan, Misamis Oriental	\N	\N	2026-06-02 10:07:39.764	2026-06-02 10:07:39.764	{}
cmpwh4pvo029wia402gbsg5ar	TRAVEL	SO Number: 2026-124	2026-124	\N	Purpose: Conduct Church Visit and Ocular Inspection\n\n	2026-04-05 16:00:00	2026-04-05 16:00:00	Claveria, Misamis Oriental	\N	\N	2026-06-02 10:07:39.781	2026-06-02 10:07:39.781	{}
cmpwh4pw502a0ia40nm0eqglr	TRAVEL	SO Number: 2026-125	2026-125	\N	Purpose: Assist LGU for CBMS Pre-DTC Requirement\n\n	2026-03-26 16:00:00	2026-03-26 16:00:00	Balingasag, Misamis Oriental	\N	\N	2026-06-02 10:07:39.798	2026-06-02 10:07:39.798	{}
cmpwh4px902aaia40g6sf5cac	TRAVEL	SO Number: 2026-126	2026-126	\N	Purpose: Attend the Solemnizing Officer Seminar and Conduct National ID information Drive\n\n	2026-03-29 16:00:00	2026-03-29 16:00:00	Camaman-an, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.837	2026-06-02 10:07:39.837	{}
cmpwh4pph027pia40t7q1cb8q	TRAINING	SO Number: 2026-117	2026-117	\N	Purpose: To Attend the 3rd Level Training of April 2026 Quarterly Labor Force Survey (LFS)\n\n	2026-04-05 16:00:00	2026-04-06 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.558	2026-06-02 10:32:04.009	{}
cmpwh4ps9028zia40bu7oouha	TRAINING	SO Number: 2026-119	2026-119	\N	Purpose: To Attend the 3rd Level Training of Palay and Corn Production Survey\n\n	2026-03-24 16:00:00	2026-03-25 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.658	2026-06-02 10:32:04.012	{}
cmpwh4pxy02agia400womkze8	TRAVEL	SO Number: 2026-127	2026-127	\N	Purpose: Conduct 1st Quarter 2026 Livestock and Poultry Survey: Establishment (LPS:E) Supervision\n\n	2026-03-27 16:00:00	2026-04-09 16:00:00	Cagayan de Oro City, Alubijid, Balingasag, Claveria, Gingoog City, Initao, Lagonglong, Magsaysay, Manticao, Medina, Opol, Salay, El Salvador City, Gitagum, Jasaan, Laguindingan, Naawan, and Villanueva, Misamis Oriental	\N	\N	2026-06-02 10:07:39.862	2026-06-02 10:07:39.862	{}
cmpwh4pyk02amia409zjsdwf0	TRAVEL	SO Number: 2026-128	2026-128	\N	Purpose: Conduct 1st Quarter 2026 Livestock and Poultry Survey: Household (LPS:H) Supervision\n\n	2026-03-27 16:00:00	2026-04-09 16:00:00	Cagayan de Oro City, Alubijid, Claveria, Gingoog City, Initao, Lagonglong, Magsaysay, Manticao, Medina, Ool, and Salay, Misamis Oriental	\N	\N	2026-06-02 10:07:39.884	2026-06-02 10:07:39.884	{}
cmpwh4pz702asia40fmsdpvsc	TRAVEL	SO Number: 2026-129	2026-129	\N	Purpose: Conduct 1st Quarter April 2026 Labor Force Survey (LFS) Field Supervision\n\n	2026-04-07 16:00:00	2026-04-29 16:00:00	Cagayan de Oro City, El Salvador City, Gingoog City, Initao, Jasaan, Lugait, Manticao, Medina, Opol, Salay, Sugbongcogon, Tagoloan, and Villanueva, Misamis Oriental	\N	\N	2026-06-02 10:07:39.908	2026-06-02 10:07:39.908	{}
cmpwh4pzr02awia40mvzeoq5n	TRAVEL	SO Number: 2026-130	2026-130	\N	Purpose: Conduct Fisheries Survey Supervision\n\n	2026-04-06 16:00:00	2026-04-29 16:00:00	Manticao to Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:39.927	2026-06-02 10:07:39.927	{}
cmpwh4q0802b0ia40ekc37ytr	TRAVEL	SO Number: 2026-131	2026-131	\N	Purpose: WPS COLLECTION\n\n	2026-04-05 16:00:00	2026-04-05 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.944	2026-06-02 10:07:39.944	{}
cmpwh4q0c02b1ia40x9ccwmpk	TRAVEL	SO Number: 2026-131	2026-131	\N	Purpose: WPS COLLECTION\n\n	2026-04-07 16:00:00	2026-04-07 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.948	2026-06-02 10:07:39.948	{}
cmpwh4q0g02b2ia40eehzmdjc	TRAVEL	SO Number: 2026-131	2026-131	\N	Purpose: WPS COLLECTION\n\n	2026-04-09 16:00:00	2026-04-09 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.952	2026-06-02 10:07:39.952	{}
cmpwh4q0l02b3ia40e9dzhebb	TRAVEL	SO Number: 2026-131	2026-131	\N	Purpose: WPS COLLECTION\n\n	2026-04-12 16:00:00	2026-04-12 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.957	2026-06-02 10:07:39.957	{}
cmpwh4q0q02b4ia40zil19dtq	TRAVEL	SO Number: 2026-131	2026-131	\N	Purpose: WPS COLLECTION\n\n	2026-04-14 16:00:00	2026-04-14 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.962	2026-06-02 10:07:39.962	{}
cmpwh4q0u02b5ia40leyxz8q0	TRAVEL	SO Number: 2026-131	2026-131	\N	Purpose: WPS COLLECTION\n\n	2026-04-16 16:00:00	2026-04-16 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.966	2026-06-02 10:07:39.966	{}
cmpwh4q0y02b6ia40179vh3fw	TRAVEL	SO Number: 2026-131	2026-131	\N	Purpose: WPS COLLECTION\n\n	2026-04-19 16:00:00	2026-04-19 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.971	2026-06-02 10:07:39.971	{}
cmpwh4q1302b7ia40gqpigl8s	TRAVEL	SO Number: 2026-131	2026-131	\N	Purpose: WPS COLLECTION\n\n	2026-04-21 16:00:00	2026-04-21 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.975	2026-06-02 10:07:39.975	{}
cmpwh4q1702b8ia409o4j9fp9	TRAVEL	SO Number: 2026-131	2026-131	\N	Purpose: WPS COLLECTION\n\n	2026-04-23 16:00:00	2026-04-23 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.98	2026-06-02 10:07:39.98	{}
cmpwh4q1b02b9ia405dmcoct4	TRAVEL	SO Number: 2026-131	2026-131	\N	Purpose: WPS COLLECTION\n\n	2026-04-26 16:00:00	2026-04-26 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.984	2026-06-02 10:07:39.984	{}
cmpwh4q1f02baia40m5jwwjwo	TRAVEL	SO Number: 2026-131	2026-131	\N	Purpose: WPS COLLECTION\n\n	2026-04-28 16:00:00	2026-04-28 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:39.988	2026-06-02 10:07:39.988	{}
cmpwh4q1u02beia4083s9wgbf	TRAVEL	SO Number: 2026-132	2026-132	\N	Purpose: Conduct 1st Quarter QSPBI Distribution of Questionnaires\n\n	2001-06-30 16:00:00	2001-06-30 16:00:00	Gingoog City to Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.003	2026-06-02 10:07:40.003	{}
cmpwh4q2b02biia402c138h0f	TRAVEL	SO Number: 2026-133	2026-133	\N	Purpose: Assist LGU for CBMS Pre-DTC Requirement\n\n	2026-04-05 16:00:00	2026-04-05 16:00:00	Claveria, Misamis Oriental	\N	\N	2026-06-02 10:07:40.02	2026-06-02 10:07:40.02	{}
cmpwh4q2z02boia40oqsk6evm	TRAVEL	SO Number: 2026-134	2026-134	\N	Purpose: Conduct Field Supervision for Monthly Palay and Corn Monitoring System, Rice and Corn Stocks Survey\n\n	2026-04-05 16:00:00	2026-04-05 16:00:00	Claveria, Misamis Oriental	\N	\N	2026-06-02 10:07:40.043	2026-06-02 10:07:40.043	{}
cmpwh4q3e02bsia403dia7u38	TRAVEL	SO Number: 2026-135	2026-135	\N	Purpose: Conduct 2nd Quarter National ID Field Operation\n\n	2000-12-31 16:00:00	2000-12-31 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:40.058	2026-06-02 10:07:40.058	{}
cmpwh4q4002byia403d75tcq0	TRAVEL	SO Number: 2026-136	2026-136	\N	Purpose: Conduct MISSI and PPS Distribution of Forms, Foreign Trade Collection, and QSPBI Coordination\n\n	2026-04-06 16:00:00	2026-04-06 16:00:00	Villanueva, Tagoloan, Cagayan de Oro City, El Salvador City, and Manticao, Misamis Oriental	\N	\N	2026-06-02 10:07:40.08	2026-06-02 10:07:40.08	{}
cmpwh4q4u02c6ia403fcxzko5	TRAVEL	SO Number: 2026-137	2026-137	\N	Purpose: Conduct Local Civil Registry Office (LCRO) Evaluation\n\n	2026-04-13 16:00:00	2026-04-13 16:00:00	Balingasag, and Sugbongcogon, Misamis Oriental	\N	\N	2026-06-02 10:07:40.111	2026-06-02 10:07:40.111	{}
cmpwh4q6b02cmia40ncexig5e	TRAVEL	SO Number: 2026-139	2026-139	\N	Purpose: Conduct Coordination Meeting with DSWD for CBMS and National ID Verification\n\n	2026-04-07 16:00:00	2026-04-07 16:00:00	Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.163	2026-06-02 10:07:40.163	{}
cmpwh4q7002csia40m3rq79lp	TRAVEL	SO Number: 2026-140	2026-140	\N	Purpose: Serve Notice of 2026 MISSI and PPS\n\n	2026-04-14 16:00:00	2026-04-14 16:00:00	Cagayan de Oro City, Tagoloan, and Villanueva, Misamis Oriental	\N	\N	2026-06-02 10:07:40.188	2026-06-02 10:07:40.188	{}
cmpwh4q7i02d0ia40pnikg4sj	TRAVEL	SO Number: 2026-141	2026-141	\N	Purpose: Conduct National ID Special Registration\n\n	2026-04-10 16:00:00	2026-04-10 16:00:00	Cagayan de Oro City, El Salvador City, Tagoloan, and Villanueva, Misamis Oriental	\N	\N	2026-06-02 10:07:40.207	2026-06-02 10:07:40.207	{}
cmpwh4q8202d4ia40thglsdkp	TRAVEL	SO Number: 2026-142	2026-142	\N	Purpose: Conduct 2026 CBMS Data Collection and Verification of the DSWD Social Protection Beneficiaries\n\n	2026-04-12 16:00:00	2026-05-21 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:40.226	2026-06-02 10:07:40.226	{}
cmpwh4q8u02dcia400gkznb1e	TRAVEL	SO Number: 2026-143	2026-143	\N	Purpose: Conduct Local Civil Registry Office (LCRO) Evaluation\n\n	2026-04-22 16:00:00	2026-04-22 16:00:00	Jasaan, and Villlanueva, Misamis Oriental	\N	\N	2026-06-02 10:07:40.254	2026-06-02 10:07:40.254	{}
cmpwh4q9u02dkia403yvj51b1	TRAVEL	SO Number: 2026-145	2026-145	\N	Purpose: Conduct 2026 QSPBI 1st Quarter Collection of Questionnaires\n\n	2026-04-12 16:00:00	2026-04-29 16:00:00	Selected Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:40.29	2026-06-02 10:07:40.29	{}
cmpwh4qar02dyia40wuzgms02	TRAVEL	SO Number: 2026-146	2026-146	\N	Purpose: Transport National ID Registration Kits and Conduct Church Visit and Ocular Inspection\n\n	2026-04-14 16:00:00	2026-04-14 16:00:00	Magsaysay and Gingoog City, Misamis Oriental	\N	\N	2026-06-02 10:07:40.323	2026-06-02 10:07:40.323	{}
cmpwh4qbl02e8ia40rlv2az9l	TRAVEL	SO Number: 2026-147	2026-147	\N	Purpose: Conduct National ID Mobile Registration\n\n	2026-04-17 16:00:00	2026-04-17 16:00:00	Baikingon, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.354	2026-06-02 10:07:40.354	{}
cmpwh4q9g02dgia40z37kusgc	TRAINING	SO Number: 2026-144	2026-144	\N	Purpose: Attend 3rd Level Training on 2025 Annual Survey of Philippine Business and Industry (ASPBI) and 2025 Survey of Tourism Establishment in the Philippines\n\n	2026-04-12 16:00:00	2026-04-16 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.276	2026-06-02 10:32:04.017	{}
cmpwh4qc302ecia4037bj70lc	TRAVEL	SO Number: 2026-148	2026-148	\N	Purpose: Conduct BRAP Mobile Registration and Awarding of BRAP Beneficiaries\n\n	2026-04-15 16:00:00	2026-04-15 16:00:00	Sambulawan, El Salvador City	\N	\N	2026-06-02 10:07:40.372	2026-06-02 10:07:40.372	{}
cmpwh4qd202emia40vgi8twx2	TRAVEL	SO Number: 2026-149	2026-149	\N	Purpose: Conduct Distribution of QSPBI for PPA, Collection of Building Permits and Certificate of Completion, and CPI Spotchecking\n\n	2026-04-27 16:00:00	2026-04-28 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:40.407	2026-06-02 10:07:40.407	{}
cmpwh4qd902enia402rtyp64h	TRAVEL	SO Number: 2026-149	2026-149	\N	Purpose: Conduct Distribution of QSPBI for PPA, Collection of Building Permits and Certificate of Completion, and CPI Spotchecking\n\n	2026-05-03 16:00:00	2026-05-06 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:40.413	2026-06-02 10:07:40.413	{}
cmpwh4qe302evia40svzj1s57	TRAVEL	SO Number: 2026-150	2026-150	\N	Purpose: Conduct Local Civil Registry Office (LCRO) Evaluation\n\n	2026-04-29 16:00:00	2026-04-29 16:00:00	Tagoloan and Claveria, Misamis Oriental	\N	\N	2026-06-02 10:07:40.444	2026-06-02 10:07:40.444	{}
cmpwh4qez02f3ia401pv1fkhf	TRAVEL	SO Number: 2026-151	2026-151	\N	Purpose: Pick up and Transport Central Office Personnel and Attend Arraignment and Pre-Trial Conference\n\n	2026-04-21 16:00:00	2026-04-23 16:00:00	Laguindingan Airport, Laguindingan, Misamis Oriental and Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.476	2026-06-02 10:07:40.476	{}
cmpwh4qg902ffia40rns69j4r	TRAVEL	SO Number: 2026-153	2026-153	\N	Purpose: Conduct Field Supervision of 2025 Annual Survey of Philippine Business and Indsutry and 2025 Survey of Tourism Esteablishment in the Philippines (STEP)\n\n	2026-04-26 16:00:00	2026-07-30 16:00:00	Selected Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:40.522	2026-06-02 10:07:40.522	{}
cmpwh4qh002flia40kykhb67s	TRAVEL	SO Number: 2026-154	2026-154	\N	Purpose: Conduct Church Visit and Ocular Inspection\n\n	2026-04-27 16:00:00	2026-04-27 16:00:00	Gitagum and Alubijid, Misamis Oriental	\N	\N	2026-06-02 10:07:40.549	2026-06-02 10:07:40.549	{}
cmpwh4qi102fxia40fegili8f	TRAVEL	SO Number: 2026-155	2026-155	\N	Purpose: Conduct Roll out of Administrative Petition for Correction Automated System (APCAS)\n\n	2026-05-10 16:00:00	2026-05-11 16:00:00	El Salvador City, Misamis Oriental	\N	\N	2026-06-02 10:07:40.586	2026-06-02 10:07:40.586	{}
cmpwh4qim02g1ia40i1714i6i	TRAVEL	SO Number: 2026-156	2026-156	\N	Purpose: Conduct BRAP Mobile Registration and Awarding of BRAP Beneficiaries\n\n	2026-04-22 16:00:00	2026-04-22 16:00:00	Himaya, El Salvador Ctiy, Misamis Oriental	\N	\N	2026-06-02 10:07:40.607	2026-06-02 10:07:40.607	{}
cmpwh4qjj02g9ia4044m1uoee	TRAVEL	SO Number: 2026-158	2026-158	\N	Purpose: Conduct the Field Operation on 2025 Household Survey on Domestic Visitor (HSDV)\n\n	2026-05-03 16:00:00	2026-05-25 16:00:00	Selected Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:40.639	2026-06-02 10:07:40.639	{}
cmpwh4qkb02gfia405r8cgr5u	TRAVEL	SO Number: 2026-159	2026-159	\N	Purpose: Conduct 2025 Household Survey on Domestic Visitor (HSDV) Field Supervision\n\n	2026-05-03 16:00:00	2026-05-25 16:00:00	Selected Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:40.667	2026-06-02 10:07:40.667	{}
cmpwh4qla02gnia40c8nz8krn	TRAVEL	SO Number: 2026-160	2026-160	\N	Purpose: National ID Special Registration\n\n	2026-04-24 16:00:00	2026-04-24 16:00:00	within Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.702	2026-06-02 10:07:40.702	{}
cmpwh4qm302gvia40xexwlmkc	TRAVEL	SO Number: 2026-161	2026-161	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-05-01 16:00:00	2026-05-05 16:00:00	within Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.732	2026-06-02 10:07:40.732	{}
cmpwh4qm802gwia40elhh7wet	TRAVEL	SO Number: 2026-161	2026-161	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-05-14 16:00:00	2026-05-16 16:00:00	within Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.737	2026-06-02 10:07:40.737	{}
cmpwh4qn102h4ia40au175hp1	TRAVEL	SO Number: 2026-162	2026-162	\N	Purpose: Weekly CPI Collection for Petroleum and LPG\n\n	2026-04-30 16:00:00	2026-05-30 16:00:00	Gusa, Lapasan, Camaman-an, Carmen and Kauswagan, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.766	2026-06-02 10:07:40.766	{}
cmpwh4qno02haia40qo30royj	TRAVEL	SO Number: 2026-163	2026-163	\N	Purpose: Collect Foreign Trade Documents\n\n	2026-05-05 16:00:00	2026-05-05 16:00:00	Bugo and Macabalan, Cagayan de Oro City and Tagoloan, Misamis Oriental	\N	\N	2026-06-02 10:07:40.789	2026-06-02 10:07:40.789	{}
cmpwh4qo902heia4069r0n696	TRAVEL	SO Number: 2026-164	2026-164	\N	Purpose: To Conduct Field Supervision for Monthly Palay and Corn Monitoring System, Rice and Corn Stock Survey and Retail Price Survey\n\n	2026-04-30 16:00:00	2026-05-14 16:00:00	Cagayan de Oro City to Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:40.809	2026-06-02 10:07:40.809	{}
cmpwh4qot02hiia40988jxkhx	TRAVEL	SO Number: 2026-165	2026-165	\N	Purpose: Conduct BRAP Mobile Registration and Awarding of BRAP Beneficiaries\n\n	2026-04-29 16:00:00	2026-04-29 16:00:00	Lumbo, Lagonglong, Misamis Oriental	\N	\N	2026-06-02 10:07:40.829	2026-06-02 10:07:40.829	{}
cmpwh4qpn02hqia40k6yxb6rb	TRAVEL	SO Number: 2026-166	2026-166	\N	Purpose: Conduct 2025 Household Survey on Domestic Visitor (HSDV) Field Supervision with Central Office Personnel\n\n	2026-05-04 16:00:00	2026-05-05 16:00:00	Cagayan de Oro City to Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:40.859	2026-06-02 10:07:40.859	{}
cmpwh4qq902huia40nk6y9v57	TRAVEL	SO Number: 2026-167	2026-167	\N	Purpose: Conduct Fisheries Survey Supervision\n\n	2026-05-05 16:00:00	2026-05-30 16:00:00	Manticao to Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:40.882	2026-06-02 10:07:40.882	{}
cmpwh4qqy02hyia40uohfp26r	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-04-30 16:00:00	2026-04-30 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.906	2026-06-02 10:07:40.906	{}
cmpwh4qr402hzia406nq1bkm4	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-03 16:00:00	2026-05-03 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.912	2026-06-02 10:07:40.912	{}
cmpwh4qra02i0ia4004fbdu75	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-05 16:00:00	2026-05-05 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.918	2026-06-02 10:07:40.918	{}
cmpwh4qrf02i1ia40v8f44kur	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-07 16:00:00	2026-05-07 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.923	2026-06-02 10:07:40.923	{}
cmpwh4qrk02i2ia4051yg7wfs	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-10 16:00:00	2026-05-10 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.928	2026-06-02 10:07:40.928	{}
cmpwh4qrp02i3ia40kogs8q89	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-12 16:00:00	2026-05-12 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.934	2026-06-02 10:07:40.934	{}
cmpwh4qrv02i4ia40wznjl6it	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-14 16:00:00	2026-05-14 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.94	2026-06-02 10:07:40.94	{}
cmpwh4qs002i5ia403c3numxp	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-17 16:00:00	2026-05-17 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.945	2026-06-02 10:07:40.945	{}
cmpwh4qs402i6ia404civ2lv9	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-19 16:00:00	2026-05-19 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.949	2026-06-02 10:07:40.949	{}
cmpwh4qs902i7ia40ddpe4xia	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-21 16:00:00	2026-05-21 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.953	2026-06-02 10:07:40.953	{}
cmpwh4qsn02iaia40ikmfr3ql	TRAVEL	SO Number: 2026-168	2026-168	\N	Purpose: WPS COLLECTION\n\n	2026-05-28 16:00:00	2026-05-28 16:00:00	Bulua Landing Center, Bulua, Cagayan de Oro City	\N	\N	2026-06-02 10:07:40.968	2026-06-02 10:07:40.968	{}
cmpwh4qt602ieia40f4xzhj1e	TRAVEL	SO Number: 2026-169	2026-169	\N	Purpose: 1st Quarter QSPI Collection \nof Questionnaires\n\n	2026-05-06 16:00:00	2026-05-07 16:00:00	Tagoloan, Villanueva, Jasaan, Balingasag, Balingoan, Talisayan, and Gingoog City,  Misamis Oriental	\N	\N	2026-06-02 10:07:40.986	2026-06-02 10:07:40.986	{}
cmpwh4qu602ioia40py8e1ik8	TRAVEL	SO Number: 2026-171	2026-171	\N	Purpose: Conduct 2024 Community-Based Monitoring System (CBMS) Data Turn Over\n\n	2026-05-03 16:00:00	2026-05-03 16:00:00	Opol, El Salvador City, Alubijid,	\N	\N	2026-06-02 10:07:41.022	2026-06-02 10:07:41.022	{}
cmpwh4quy02iwia40t5p30dpw	TRAVEL	SO Number: 2026-172	2026-172	\N	Purpose: Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-05-04 16:00:00	2026-05-04 16:00:00	Banglay, Lagonglong, Misamis Oriental	\N	\N	2026-06-02 10:07:41.05	2026-06-02 10:07:41.05	{}
cmpwh4qvx02j4ia40xewytioh	TRAVEL	SO Number: 2026-173	2026-173	\N	Purpose: Conduct May 2026 Labor Force Survey (LFS) Field Supervision\n\n	2026-05-06 16:00:00	2026-05-30 16:00:00	Medina, Kinoguitan, Jasaan, Alubijid, and Tagoloan, Misamis Oriental	\N	\N	2026-06-02 10:07:41.086	2026-06-02 10:07:41.086	{}
cmpwh4qwc02j8ia40tvwwzfsp	TRAVEL	SO Number: 2026-174	2026-174	\N	Purpose: Conduct 2026 Community-Based Monitoring System (CBMS) Data Collection and Verification of the DSWD Social Protection Beneficiaries\n\n	2026-05-06 16:00:00	2026-05-28 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:41.1	2026-06-02 10:07:41.1	{}
cmpwh4qxz02joia40c00gm85c	TRAVEL	SO Number: 2026-176	2026-176	\N	Purpose: Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board\n\n	2026-05-11 16:00:00	2026-05-11 16:00:00	Lugait, and Manticao, Misamis Oriental	\N	\N	2026-06-02 10:07:41.16	2026-06-02 10:07:41.16	{}
cmpwh4qyp02jyia407i36x0yb	TRAVEL	SO Number: 2026-177	2026-177	\N	Purpose: Conduct Coordination and Field Supervision of 2025 Household Survey on Domestic VIsitor (HSDV)\n\n	2026-05-17 16:00:00	2026-05-17 16:00:00	Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:41.185	2026-06-02 10:07:41.185	{}
cmpwh4qzh02k6ia408ife8rs1	TRAVEL	SO Number: 2026-178	2026-178	\N	Purpose: Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board\n\n	2026-05-13 16:00:00	2026-05-13 16:00:00	Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:41.213	2026-06-02 10:07:41.213	{}
cmpwh4r0902keia40kyn1anez	TRAVEL	SO Number: 2026-179	2026-179	\N	Purpose: Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board\n\n	2026-05-12 16:00:00	2026-05-12 16:00:00	Jasaan, and Villlanueva, Misamis Oriental	\N	\N	2026-06-02 10:07:41.242	2026-06-02 10:07:41.242	{}
cmpwh4r1502kmia40ok10lchc	TRAVEL	SO Number: 2026-180	2026-180	\N	Purpose: Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board\n\n	2026-05-13 16:00:00	2026-05-13 16:00:00	Opol, Misamis Oriental	\N	\N	2026-06-02 10:07:41.274	2026-06-02 10:07:41.274	{}
cmpwh4r2302l0ia40lwcxazyq	TRAVEL	SO Number: 2026-181	2026-181	\N	Purpose: Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-05-13 16:00:00	2026-05-13 16:00:00	Ulaliman, El Salvador City, Misamis Oriental	\N	\N	2026-06-02 10:07:41.308	2026-06-02 10:07:41.308	{}
cmpwh4r3102laia40upo0l73k	TRAVEL	SO Number: 2026-182	2026-182	\N	Purpose: Conduct Local Civil Registry Office (LCRO) Evaluation\n\n	2026-05-13 16:00:00	2026-05-13 16:00:00	Libertad, Alubijid, Opol, and El Salvador City, Misamis Oriental	\N	\N	2026-06-02 10:07:41.342	2026-06-02 10:07:41.342	{}
cmpwh4r3602lbia402cks29dw	TRAVEL	SO Number: 2026-182	2026-182	\N	Purpose: Conduct Local Civil Registry Office (LCRO) Evaluation\n\n	2026-05-18 16:00:00	2026-05-18 16:00:00	Libertad, Alubijid, Opol, and El Salvador City, Misamis Oriental	\N	\N	2026-06-02 10:07:41.346	2026-06-02 10:07:41.346	{}
cmpwh4r4502lria403wjtuy5y	TRAVEL	SO Number: 2026-183	2026-183	\N	Purpose: To Attend KLAREX nga SERBISYO SA BARYO (KSB) "Kasalan sa Baryo" and To Conduct PhilSys and BRAP Mobile Registration and Awarading of BRAP Beneficiaries\n\n	2026-05-15 16:00:00	2026-05-15 16:00:00	Baikingon, Cagayan de Oro City	\N	\N	2026-06-02 10:07:41.381	2026-06-02 10:07:41.381	{}
cmpwh4r4t02lzia40fyntlfg6	TRAVEL	SO Number: 2026-184	2026-184	\N	Purpose: Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board\n\n	2026-05-17 16:00:00	2026-05-17 16:00:00	Naawan, and Initao, Misamis Oriental	\N	\N	2026-06-02 10:07:41.406	2026-06-02 10:07:41.406	{}
cmpwh4r5x02mfia40mrbi2p6q	TRAVEL	SO Number: 2026-185	2026-185	\N	Purpose: Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board and Transport National ID Registration Kits\n\n	2026-05-18 16:00:00	2026-05-18 16:00:00	Balingasag, Sugbongcogon, Kinoguitan, and Balingoan, Misamis Oriental	\N	\N	2026-06-02 10:07:41.445	2026-06-02 10:07:41.445	{}
cmpwh4r6o02mnia40u1dmdbgj	TRAVEL	SO Number: 2026-186	2026-186	\N	Purpose: Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board\n\n	2026-05-19 16:00:00	2026-05-19 16:00:00	Libertad, and Gitagum, Misamis Oriental	\N	\N	2026-06-02 10:07:41.472	2026-06-02 10:07:41.472	{}
cmpwh4r7702mria40hpp4y6kb	TRAVEL	SO Number: 2026-187	2026-187	\N	Purpose: Conduct Supervision on National ID Operation\n\n	2026-05-14 16:00:00	2026-05-14 16:00:00	National ID Fixed Registration Center, Cagayan de Oro City	\N	\N	2026-06-02 10:07:41.491	2026-06-02 10:07:41.491	{}
cmpwh4r7b02msia40601q9kfe	TRAVEL	SO Number: 2026-187	2026-187	\N	Purpose: Conduct Supervision on National ID Operation\n\n	2026-05-21 16:00:00	2026-05-21 16:00:00	National ID Fixed Registration Center, Cagayan de Oro City	\N	\N	2026-06-02 10:07:41.496	2026-06-02 10:07:41.496	{}
cmpwh4r8402myia40jfdizyql	TRAVEL	SO Number: 2026-188	2026-188	\N	Purpose: Conduct City Civil Registry Office (CCRO) Evaluation\n\n	2026-05-19 16:00:00	2026-05-19 16:00:00	Cagayan de Oro City	\N	\N	2026-06-02 10:07:41.524	2026-06-02 10:07:41.524	{}
cmpwh4r8u02n8ia408x5y52l2	TRAVEL	SO Number: 2026-189	2026-189	\N	Purpose: Conduct BRAP and National ID Mobile Registration and Implementation of BRAP\n\n	2026-05-20 16:00:00	2026-05-20 16:00:00	Quibonbon, El Salvador City	\N	\N	2026-06-02 10:07:41.55	2026-06-02 10:07:41.55	{}
cmpwh4r9b02ncia40d44uhk60	TRAVEL	SO Number: 2026-190	2026-190	\N	Purpose: Conduct Church Visit and Ocular Inspection\n\n	2026-05-27 16:00:00	2026-05-27 16:00:00	Villanueva, Misamis Oriental	\N	\N	2026-06-02 10:07:41.568	2026-06-02 10:07:41.568	{}
cmpwh4r9t02ngia40t5tal3kc	TRAVEL	SO Number: 2026-191	2026-191	\N	Purpose: Conduct National ID Field Supervision\n\n	2026-05-21 16:00:00	2026-05-21 16:00:00	Villanueva, Misamis Oriental	\N	\N	2026-06-02 10:07:41.585	2026-06-02 10:07:41.585	{}
cmpwh4ral02noia40rd8oy0w2	TRAVEL	SO Number: 2026-192	2026-192	\N	Purpose: Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board\n\n	2026-05-24 16:00:00	2026-05-24 16:00:00	Talisayan, Misamis Oriental	\N	\N	2026-06-02 10:07:41.613	2026-06-02 10:07:41.613	{}
cmpwh4rba02nwia400qijj4ak	TRAVEL	SO Number: 2026-193	2026-193	\N	Purpose: Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board\n\n	2026-05-25 16:00:00	2026-05-25 16:00:00	El Salvador City, and Laguindingan, Misamis Oriental	\N	\N	2026-06-02 10:07:41.639	2026-06-02 10:07:41.639	{}
cmpwh4rc002o2ia408ha0dk6h	TRAVEL	SO Number: 2026-194	2026-194	\N	Purpose: Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board\n\n	2026-05-27 16:00:00	2026-05-27 16:00:00	Claveria, and Tagoloan, Misamis Oriental	\N	\N	2026-06-02 10:07:41.665	2026-06-02 10:07:41.665	{}
cmpwh4rcq02oaia4060b4rmr9	TRAVEL	SO Number: 2026-195	2026-195	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-05-31 16:00:00	2026-06-04 16:00:00	within Cagayan de Oro City	\N	\N	2026-06-02 10:07:41.69	2026-06-02 10:07:41.69	{}
cmpwh4rcv02obia40uppminaf	TRAVEL	SO Number: 2026-195	2026-195	\N	Purpose: Bi-weekly CPI Collection\n\n	2026-06-14 16:00:00	2026-06-16 16:00:00	within Cagayan de Oro City	\N	\N	2026-06-02 10:07:41.696	2026-06-02 10:07:41.696	{}
cmpwh4qww02jcia40bhk5mu8o	TRAINING	SO Number: 2026-175	2026-175	\N	Purpose: Conduct PhilCris Training\n\n	2026-05-10 16:00:00	2026-05-10 16:00:00	Villanueva, Misamis Oriental	\N	\N	2026-06-02 10:07:41.12	2026-06-02 10:32:04.022	{TRAVEL}
cmpwh4rdn02ojia40ct0aav17	TRAVEL	SO Number: 2026-196	2026-196	\N	Purpose: Weekly CPI Collection for \nPetroleum and LPG\n\n	2026-05-31 16:00:00	2026-06-29 16:00:00	Gusa, Lapasan, Camaman-an, Carmen and Kauswagan, Cagayan de Oro City	\N	\N	2026-06-02 10:07:41.723	2026-06-02 10:07:41.723	{}
cmpwh4reb02opia40buxwnsmd	TRAVEL	SO Number: 2026-197	2026-197	\N	Purpose: Collect Foreign Trade Documents\n\n	2026-06-02 16:00:00	2026-06-04 16:00:00	Bugo, Macabalan, Cagayan de Oro City, Tagoloan	\N	\N	2026-06-02 10:07:41.747	2026-06-02 10:07:41.747	{}
cmpwh4rfv02p7ia4000hl1b1g	TRAVEL	SO Number: 2026-199	2026-199	\N	Purpose: Conduct a 5 Mminute Talk During the National ID Mobile Registration with Clients to Discuss the Importance of the National ID in Paper and Digital Form and How it Will Help Filipino Access Their Basic Needs and Conduct BRAP and National ID Mobile Registration\n\n	2026-05-27 16:00:00	2026-05-27 16:00:00	Casinglot, Tagoloan, Misamis Oriental	\N	\N	2026-06-02 10:07:41.804	2026-06-02 10:07:41.804	{}
cmpwh4rgb02pbia40apgyvzr6	TRAVEL	SO Number: 2026-200	2026-200	\N	Purpose: Conduct a 5 Mminute Talk During the National ID Mobile Registration with Clients to Discuss the Importance of the National ID in Paper and Digital Form and How it Will Help Filipino Access Their Basic Needs and Transport National ID Registration Kits\n\n	2026-05-28 16:00:00	2026-05-28 16:00:00	Tagoloan, and Alubijid, Misamis Oriental	\N	\N	2026-06-02 10:07:41.82	2026-06-02 10:07:41.82	{}
cmpwh4rh402pjia4094f720u8	TRAVEL	SO Number: 2026-201	2026-201	\N	Purpose: Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board\n\n	2026-05-31 16:00:00	2026-06-01 16:00:00	Salay, and Medina, Misamis Oriental	\N	\N	2026-06-02 10:07:41.848	2026-06-02 10:07:41.848	{}
cmpwh4rhx02pria40sj75n76z	TRAVEL	SO Number: 2026-202	2026-202	\N	Purpose: Conduct Collection of QSPBI for Provincial Product Accoun(PPA) and Follow-up on the Provincial Product Account (PPA)\n\n	2026-05-31 16:00:00	2026-06-03 16:00:00	Different Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:41.878	2026-06-02 10:07:41.878	{}
cmpwh4rif02pvia40y7putfiq	TRAVEL	SO Number: 2026-203	2026-203	\N	Purpose: Attend Kasalan ng Bayan and Conduct BRAP and National ID Mobile Registration\n\n	2026-06-02 16:00:00	2026-06-02 16:00:00	Gitagum, Misamis Oriental	\N	\N	2026-06-02 10:07:41.895	2026-06-02 10:07:41.895	{}
cmpwh4rjg02q3ia406rpaf473	TRAVEL	SO Number: 2026-205	2026-205	\N	Purpose: Conduct Field Operation on 2nd Quarter 2026 Crops Production Survey\n\n	2026-06-16 16:00:00	2026-06-29 16:00:00	Selected Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:41.932	2026-06-02 10:07:41.932	{}
cmpwh4ret02otia40b5a8i0np	TRAINING	SO Number: 2026-198	2026-198	\N	Purpose: Attend 3rd Level Training of June 2026 Labor Force Survey (LFS)\n\n	2026-06-03 16:00:00	2026-06-04 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:41.765	2026-06-02 10:32:04.024	{}
cmpwh4rke02qbia40k9l9bsm7	TRAVEL	SO Number: 2026-207	2026-207	\N	Purpose: Conduct Field Supervision for \nMonthly Palay and Corn Monitoring \nSystem, Rice and Corn Stocks \nSurvey\n\n	2026-05-31 16:00:00	2026-06-14 16:00:00	Cagayan de Oro City to Magsaysay, Misamis Oriental	\N	\N	2026-06-02 10:07:41.967	2026-06-02 10:07:41.967	{}
cmpwh4rla02qpia40e74z9ob0	TRAVEL	SO Number: 2026-208	2026-208	\N	Purpose: Attend KLAREX nga SERBISYO SA BARYO (KSB) "KASALAN NG BAYAN" to Conduct  BRAP Mobile Registration and Awarding of BRAP Beneficiaries\n\n	2026-05-29 16:00:00	2026-05-29 16:00:00	Puntod, Cagayan de Oro City	\N	\N	2026-06-02 10:07:41.998	2026-06-02 10:07:41.998	{}
cmpwh4rlv02qtia40ac1gd1ye	TRAVEL	SO Number: 2026-209	2026-209	\N	Purpose: Conduct Other Crops Field Supervision\n\n	2026-06-16 16:00:00	2026-07-10 16:00:00	Selected Cities and Municipalities of Misamis Oriental	\N	\N	2026-06-02 10:07:42.019	2026-06-02 10:07:42.019	{}
cmpwh4rit02pzia40ki2j9k28	TRAINING	SO Number: 2026-204	2026-204	\N	Purpose: Attend 3rd Level Training of 2nd Quarter 2026 Crops Production Survey\n\n	2026-06-07 16:00:00	2026-06-08 16:00:00	PSA Misamis Oriental Training Room, Cagayan de Oro City	\N	\N	2026-06-02 10:07:41.909	2026-06-02 10:32:04.027	{}
\.


--
-- Data for Name: CanvasTemplate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CanvasTemplate" (id, name, layout, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ChatAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatAttachment" (id, "messageId", "fileName", "fileUrl", "mimeType", "fileSize", "createdAt") FROM stdin;
cmpxnahfm005nia30gbqj6v03	cmpxnahfm005mia30d9f7d7o1	Covedr.png	/uploads/chat/1780465672631-Covedr.png	image/png	1039191	2026-06-03 05:47:52.643
cmpxnk22g006sia30v6rq6o56	cmpxnk22g006ria30zrsevc9v	Goon 2.png	/uploads/chat/1780466119274-Goon_2.png	image/png	1776369	2026-06-03 05:55:19.288
cmpxol0ia000tiap475r9nllm	cmpxol0ia000siap4eyt26ar0	Misamis Oriental.jpg	/uploads/chat/1780467843516-Misamis_Oriental.jpg	image/jpeg	2805781	2026-06-03 06:24:03.538
\.


--
-- Data for Name: ChatChannel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatChannel" (id, name, description, "channelType", "createdById", "isActive", "createdAt", "updatedAt", "photoUrl") FROM stdin;
cmq1zva1i018diaqouipq63ao	DM_cmplkm5x70000iaeg6ej70tgq_cmprowub5001miar89qh70ser	\N	DIRECT	cmplkm5x70000iaeg6ej70tgq	t	2026-06-06 06:51:02.934	2026-06-06 06:51:16.599	\N
cmpy4vfca004aiaeca2ypial5	CRVS	A group chat for civil registration and vital statistics employees only	PRIVATE	cmplkm5x70000iaeg6ej70tgq	t	2026-06-03 14:00:03.178	2026-06-03 14:07:40.189	\N
cmq4nzk4c002hia90rvlqemr8	DM: S-Rank Admin-kun & Milan L. Gutay	\N	PRIVATE	cmplkm5x70000iaeg6ej70tgq	t	2026-06-08 03:41:45.756	2026-06-08 03:41:48.804	\N
cmq3eo7fq008via2gvj7q5fob	DM: Claudevan A. Macabale & Milan L. Gutay	\N	PRIVATE	cmpp3gnhz0007iafkfwlwufi4	t	2026-06-07 06:33:13.377	2026-06-07 06:33:17.062	\N
cmpplx97b017jiazw6igxkdsn	General Chat	\N	GENERAL	cmplkm5x70000iaeg6ej70tgq	t	2026-05-28 14:47:26.424	2026-06-03 06:24:03.544	\N
cmpy58dxr004qiaecqfwr6alc	Administrative and Accounting Section	A group chat for administrative and accounting section employees only	PRIVATE	cmplkm5x70000iaeg6ej70tgq	t	2026-06-03 14:10:07.887	2026-06-03 14:10:32.406	\N
cmppllr48000wiazw1pq1dc37	PSA MisOr - IOMS Updates	This is where the new updates will be notified.	SYSTEM	cmplkm5x70000iaeg6ej70tgq	t	2026-05-28 14:38:29.769	2026-06-07 07:50:10.712	\N
cmpy5htgl005wiaec51u5vp3o	Tambayanan	Discuss non-work related stuff here	GENERAL	cmplkm5x70000iaeg6ej70tgq	t	2026-06-03 14:17:27.909	2026-06-03 14:17:27.909	\N
cmpybqypk000viauky826e3ut	Admin Feedback - cmpp3gnhz0007iafkfwlwufi4	Personal notifications for your requests.	ADMIN_FEEDBACK	\N	t	2026-06-03 17:12:32.312	2026-06-03 17:12:32.324	\N
cmpz8mb020005iajc07srqp9j	DM_cmpp3gnhz0007iafkfwlwufi4_cmplkm5x70000iaeg6ej70tgq	\N	DIRECT	cmpp3gnhz0007iafkfwlwufi4	t	2026-06-04 08:32:42.29	2026-06-16 09:30:48.615	\N
cmq2mj0vn000hia08ch98ocd4	DM: S-Rank Admin-kun & Claudevan A. Macabale	\N	PRIVATE	cmplkm5x70000iaeg6ej70tgq	t	2026-06-06 17:25:22.356	2026-06-06 17:25:22.356	\N
cmpy4phyt002yiaecgyfgs8jm	Statistical Section	A group chat for statistical section employees only	PRIVATE	cmplkm5x70000iaeg6ej70tgq	t	2026-06-03 13:55:26.646	2026-06-03 13:55:26.646	\N
cmpplfuam0004iazwz8vdat1x	Admin Requests	Protected request notifications for administrators.	ADMIN_REQUESTS	\N	t	2026-05-28 14:33:53.951	2026-07-01 01:46:54.171	\N
\.


--
-- Data for Name: ChatChannelMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatChannelMember" (id, "channelId", "userId", role, "isActive", "joinedAt") FROM stdin;
cmppllr48000yiazw8iw2gbw5	cmppllr48000wiazw1pq1dc37	cmplkm5x70000iaeg6ej70tgq	OWNER	t	2026-05-28 14:38:29.769
cmpplx97c017liazws2hx252c	cmpplx97b017jiazw6igxkdsn	cmplkm5x70000iaeg6ej70tgq	OWNER	t	2026-05-28 14:47:26.424
cmpy4ta4o0033iaeczq1vk5ee	cmpy4phyt002yiaecgyfgs8jm	cmprotgjx000iiar8nvk7aldv	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4o0035iaecnlwrdnr6	cmpy4phyt002yiaecgyfgs8jm	cmprotqbi000miar8oowhzmar	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4o0037iaecagepdleq	cmpy4phyt002yiaecgyfgs8jm	cmprou6bt000qiar8b0qy9g69	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4p0039iaecweu03zq7	cmpy4phyt002yiaecgyfgs8jm	cmprow0tb001aiar8l2pxxy5s	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4p003biaecmtr3u7hq	cmpy4phyt002yiaecgyfgs8jm	cmprowfas001eiar8lrsazwik	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4p003diaeck54hhisr	cmpy4phyt002yiaecgyfgs8jm	cmprowo9l001iiar8cij3h5w5	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4p003fiaechc57rqr5	cmpy4phyt002yiaecgyfgs8jm	cmpm4x3su001uiausw8pb2snz	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4q003hiaeckbkfpzuh	cmpy4phyt002yiaecgyfgs8jm	cmproyynl0020iar8xeh4tvgk	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4q003jiaec7hhmb0c3	cmpy4phyt002yiaecgyfgs8jm	cmprozzp6002eiar851ke8jhc	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4q003liaect2p5rqio	cmpy4phyt002yiaecgyfgs8jm	cmprp1zmr002miar8epjep3s0	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4q003niaechc6xfrai	cmpy4phyt002yiaecgyfgs8jm	cmprp32yp0032iar83wks68fy	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4q003piaeck8aagw7z	cmpy4phyt002yiaecgyfgs8jm	cmprp40vo003aiar8forj6vpj	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4r003riaecnhq4n5wj	cmpy4phyt002yiaecgyfgs8jm	cmprot6zi000eiar893u9plbx	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4r003tiaece0ljsl8p	cmpy4phyt002yiaecgyfgs8jm	cmprp48m1003eiar8xwdzkna0	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4r003viaecxn3t8axx	cmpy4phyt002yiaecgyfgs8jm	cmprp4ix5003iiar8v8fxuweo	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4r003xiaecyo9xum6h	cmpy4phyt002yiaecgyfgs8jm	cmprp531i003miar8ydi9ceuc	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4s003ziaecuuw2bi3f	cmpy4phyt002yiaecgyfgs8jm	cmprp5d5m003qiar8ufiurlvm	MEMBER	t	2026-06-03 13:58:23.111
cmpy4phyu0030iaecw8tk0ya0	cmpy4phyt002yiaecgyfgs8jm	cmplkm5x70000iaeg6ej70tgq	OWNER	t	2026-06-03 13:55:26.646
cmpy4ta4s0043iaecrnjrbm7i	cmpy4phyt002yiaecgyfgs8jm	cmprp5k9u003uiar8cjpe7aec	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4s0045iaec44ej1mjw	cmpy4phyt002yiaecgyfgs8jm	cmprp5sal003yiar8kj0bc755	MEMBER	t	2026-06-03 13:58:23.111
cmpy4ta4s0047iaecw4abanym	cmpy4phyt002yiaecgyfgs8jm	cmprp60ad0042iar8ugzse0q9	MEMBER	t	2026-06-03 13:58:23.111
cmpy5apdt004wiaecc028t7j8	cmpy4vfca004aiaeca2ypial5	cmprouhzl000uiar82bggsy0u	MEMBER	t	2026-06-03 14:11:56.033
cmpy5apdt004yiaec2h4cwvtm	cmpy4vfca004aiaeca2ypial5	cmprous7a000yiar8nmv94emc	MEMBER	t	2026-06-03 14:11:56.033
cmpy5apdu0050iaecsgdxe0a8	cmpy4vfca004aiaeca2ypial5	cmprovsp70016iar8t0atnzdo	MEMBER	t	2026-06-03 14:11:56.033
cmpy5apdu0052iaecqhilza8s	cmpy4vfca004aiaeca2ypial5	cmprp1pt3002iiar82g2ry8sv	MEMBER	t	2026-06-03 14:11:56.033
cmpy5apdu0054iaec4y3xgeik	cmpy4vfca004aiaeca2ypial5	cmprp2te8002yiar8ojq52zwk	MEMBER	t	2026-06-03 14:11:56.033
cmpy5apdu0056iaecf6gbfabc	cmpy4vfca004aiaeca2ypial5	cmprp3gz70036iar80eg0zh3i	MEMBER	t	2026-06-03 14:11:56.033
cmpy4vfca004ciaecz3khy20i	cmpy4vfca004aiaeca2ypial5	cmplkm5x70000iaeg6ej70tgq	OWNER	t	2026-06-03 14:00:03.178
cmpy5apdv005aiaecek06et07	cmpy4vfca004aiaeca2ypial5	cmprp6lub0046iar82h4r5fql	MEMBER	t	2026-06-03 14:11:56.033
cmpy5bns3005diaecg711890u	cmpy58dxr004qiaecqfwr6alc	cmpp8oomc0001iap44h6gpnob	MEMBER	t	2026-06-03 14:12:40.611
cmpy5bns3005fiaec78mixqbz	cmpy58dxr004qiaecqfwr6alc	cmprowub5001miar89qh70ser	MEMBER	t	2026-06-03 14:12:40.611
cmpy5bns3005hiaecwplvj4c7	cmpy58dxr004qiaecqfwr6alc	cmproy6y8001siar8a50hg49k	MEMBER	t	2026-06-03 14:12:40.611
cmpy5bns4005jiaec286b99xl	cmpy58dxr004qiaecqfwr6alc	cmproyjxc001wiar8nok429s7	MEMBER	t	2026-06-03 14:12:40.611
cmpy5bns4005liaecko5rc1u7	cmpy58dxr004qiaecqfwr6alc	cmprozcnh0024iar82a7i93si	MEMBER	t	2026-06-03 14:12:40.611
cmpy5bns4005niaecg95bi38l	cmpy58dxr004qiaecqfwr6alc	cmprozk560028iar8p2tu3at3	MEMBER	t	2026-06-03 14:12:40.611
cmpy5bns4005piaecd1k9uq85	cmpy58dxr004qiaecqfwr6alc	cmprp29ex002qiar8a5ddgo68	MEMBER	t	2026-06-03 14:12:40.611
cmpy58dxr004siaechtq1z5gr	cmpy58dxr004qiaecqfwr6alc	cmplkm5x70000iaeg6ej70tgq	OWNER	t	2026-06-03 14:10:07.887
cmpy5bns5005tiaec5ejmatj2	cmpy58dxr004qiaecqfwr6alc	cmprp60ad0042iar8ugzse0q9	MEMBER	t	2026-06-03 14:12:40.611
cmpy5htgl005yiaec7ghqp0xj	cmpy5htgl005wiaec51u5vp3o	cmplkm5x70000iaeg6ej70tgq	OWNER	t	2026-06-03 14:17:27.909
cmpybqypk000xiauksd72z1m5	cmpybqypk000viauky826e3ut	cmpp3gnhz0007iafkfwlwufi4	OWNER	t	2026-06-03 17:12:32.312
cmpz8mb040007iajc6gd7yrmi	cmpz8mb020005iajc07srqp9j	cmpp3gnhz0007iafkfwlwufi4	OWNER	t	2026-06-04 08:32:42.29
cmpz8mb040008iajchympcv2x	cmpz8mb020005iajc07srqp9j	cmplkm5x70000iaeg6ej70tgq	OWNER	t	2026-06-04 08:32:42.29
cmq1zva1l018fiaqoupjn8lvb	cmq1zva1i018diaqouipq63ao	cmplkm5x70000iaeg6ej70tgq	OWNER	t	2026-06-06 06:51:02.934
cmq1zva1l018giaqouqjis0rf	cmq1zva1i018diaqouipq63ao	cmprowub5001miar89qh70ser	OWNER	t	2026-06-06 06:51:02.934
cmq2mj0vo000jia089sz3o4oe	cmq2mj0vn000hia08ch98ocd4	cmplkm5x70000iaeg6ej70tgq	OWNER	t	2026-06-06 17:25:22.356
cmq2mj0vo000kia08mlzn1vsh	cmq2mj0vn000hia08ch98ocd4	cmpp3gnhz0007iafkfwlwufi4	MEMBER	t	2026-06-06 17:25:22.356
cmq3eo7fu008xia2gdj5el7it	cmq3eo7fq008via2gvj7q5fob	cmpp3gnhz0007iafkfwlwufi4	OWNER	t	2026-06-07 06:33:13.377
cmq3eo7fu008yia2gplfpaaxw	cmq3eo7fq008via2gvj7q5fob	cmprot6zi000eiar893u9plbx	MEMBER	t	2026-06-07 06:33:13.377
cmq4nzk4c002jia90br89phqq	cmq4nzk4c002hia90rvlqemr8	cmplkm5x70000iaeg6ej70tgq	OWNER	t	2026-06-08 03:41:45.756
cmq4nzk4c002kia90rp8suuui	cmq4nzk4c002hia90rvlqemr8	cmprot6zi000eiar893u9plbx	MEMBER	t	2026-06-08 03:41:45.756
\.


--
-- Data for Name: ChatMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatMessage" (id, "channelId", "senderUserId", "messageType", body, "relatedEntityType", "relatedEntityId", "metadataJson", "deletedAt", "createdAt", "updatedAt", "replyToId") FROM stdin;
cmptylos800dsialofw9eewqn	cmpplx97b017jiazw6igxkdsn	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	hi	\N	\N	\N	\N	2026-05-31 15:53:26.453	2026-05-31 15:53:26.453	\N
cmptyogkl00emialo6lhnh3aq	cmpplx97b017jiazw6igxkdsn	cmpp3gnhz0007iafkfwlwufi4	USER_MESSAGE	yo	\N	\N	\N	\N	2026-05-31 15:55:35.782	2026-05-31 15:55:35.782	\N
cmptza5rw00ikialoo0n6jg0q	cmpplx97b017jiazw6igxkdsn	cmpp3gnhz0007iafkfwlwufi4	USER_MESSAGE	afjbdfjfnwketekwntkenwtjqetknekgtmekgnwkgnkqenfqkfqefknqefkneqgjlqegjflmflrmglrwg	\N	\N	\N	\N	2026-05-31 16:12:28.22	2026-05-31 16:12:28.22	\N
cmptzb19v00itialomgkqfwfw	cmpplx97b017jiazw6igxkdsn	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333	\N	\N	\N	2026-05-31 16:15:54.763	2026-05-31 16:13:09.043	2026-05-31 16:15:54.765	\N
cmpxh9v3n0004iat0n7aovv6f	cmpplx97b017jiazw6igxkdsn	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	test	\N	\N	\N	\N	2026-06-03 02:59:26.003	2026-06-03 02:59:26.003	\N
cmpxhyfbf000fia30m7c9lsjm	cmpplx97b017jiazw6igxkdsn	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	ujyuyr	\N	\N	\N	\N	2026-06-03 03:18:31.947	2026-06-03 03:18:31.947	\N
cmptzbx2o00jsialo3lw8by0t	cmpplx97b017jiazw6igxkdsn	cmpp3gnhz0007iafkfwlwufi4	USER_MESSAGE	33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333	\N	\N	\N	2026-06-03 03:22:50.724	2026-05-31 16:13:50.257	2026-06-03 03:22:50.726	\N
cmptzbbdw00jhialowgxlnyjt	cmpplx97b017jiazw6igxkdsn	cmpp3gnhz0007iafkfwlwufi4	USER_MESSAGE	33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333	\N	\N	\N	2026-06-03 03:22:53.33	2026-05-31 16:13:22.149	2026-06-03 03:22:53.332	\N
cmpxnahfm005mia30d9f7d7o1	cmpplx97b017jiazw6igxkdsn	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	Attached Covedr.png	\N	\N	\N	\N	2026-06-03 05:47:52.643	2026-06-03 05:47:52.643	\N
cmpxol0ia000siap4eyt26ar0	cmpplx97b017jiazw6igxkdsn	cmpp3gnhz0007iafkfwlwufi4	USER_MESSAGE		\N	\N	\N	\N	2026-06-03 06:24:03.538	2026-06-03 06:24:03.538	\N
cmpy1jia40004ia306rhmk9s1	cmpplfuam0004iazwz8vdat1x	cmpp3gnhz0007iafkfwlwufi4	REQUEST_STATUS_UPDATE	Room reservation cancelled by Claudevan A. Macabale. Room Reservation is now CANCELLED.	RoomReservation	cmpp40flj000xiafk3c3b50ct	{"href": "/room-reservations/admin#room-reservation-cmpp40flj000xiafk3c3b50ct", "status": "CANCELLED", "details": {"Room": "Training Room", "Status": "CANCELLED", "Updated": "Jun 3, 2026 8:26 PM", "Schedule": "Jun 1, 2026 - Jun 3, 2026", "Requester": "Claudevan A. Macabale"}, "actorName": "Claudevan A. Macabale", "actionLabel": "Room reservation cancelled", "requestType": "Room Reservation"}	\N	2026-06-03 12:26:48.268	2026-06-03 12:26:48.268	\N
cmpy28qg30007iaecrnayvvbh	cmpplfuam0004iazwz8vdat1x	\N	REQUEST_NOTIFICATION	Room Reservation submitted by Claudevan A. Macabale for Pantry 1.	RoomReservation	cmpy28qfe0002iaecqowhu7bh	{"href": "/room-reservations/admin#room-reservation-cmpy28qfe0002iaecqowhu7bh", "status": "PENDING", "details": {"Room": "Pantry 1", "Status": "PENDING", "Created": "Jun 3, 2026 8:46 PM", "Purpose": "Training for Super Saiyan", "Schedule": "Jun 10, 2026 (morning)", "Requester": "Claudevan A. Macabale"}, "requestType": "Room Reservation"}	\N	2026-06-03 12:46:25.251	2026-06-03 12:46:25.251	\N
cmpy36bo3000aiaecsjr4z6vp	cmpplfuam0004iazwz8vdat1x	cmplkm5x70000iaeg6ej70tgq	REQUEST_STATUS_UPDATE	Room reservation rejected by S-Rank Admin-kun. Room Reservation is now REJECTED.	RoomReservation	cmpy28qfe0002iaecqowhu7bh	{"href": "/room-reservations/admin#room-reservation-cmpy28qfe0002iaecqowhu7bh", "status": "REJECTED", "details": {"Room": "Pantry 1", "Status": "REJECTED", "Updated": "Jun 3, 2026 9:12 PM", "Schedule": "Jun 10, 2026 (morning)", "Requester": "Claudevan A. Macabale"}, "actorName": "S-Rank Admin-kun", "actionLabel": "Room reservation rejected", "requestType": "Room Reservation"}	\N	2026-06-03 13:12:32.403	2026-06-03 13:12:32.403	\N
cmpxnk22g006ria30zrsevc9v	cmpplx97b017jiazw6igxkdsn	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE		\N	\N	\N	2026-06-03 13:38:03.625	2026-06-03 05:55:19.288	2026-06-03 13:38:03.628	\N
cmpy5igzw0066iaeceiz60g9u	cmpplfuam0004iazwz8vdat1x	\N	REQUEST_NOTIFICATION	Room Reservation submitted by Claudevan A. Macabale for Pantry 1.	RoomReservation	cmpy5igz80061iaecxylz0rmu	{"href": "/room-reservations/admin#room-reservation-cmpy5igz80061iaecxylz0rmu", "status": "PENDING", "details": {"Room": "Pantry 1", "Status": "PENDING", "Created": "Jun 3, 2026 10:17 PM", "Purpose": "Training", "Schedule": "Jun 4, 2026 - Jun 5, 2026", "Requester": "Claudevan A. Macabale"}, "requestType": "Room Reservation"}	\N	2026-06-03 14:17:58.413	2026-06-03 14:17:58.413	\N
cmpy5j8vo006diaeckvgrkbgz	cmpplfuam0004iazwz8vdat1x	\N	REQUEST_NOTIFICATION	Room Reservation submitted by Claudevan A. Macabale for Pantry 2.	RoomReservation	cmpy5j8v70068iaecnybvds3e	{"href": "/room-reservations/admin#room-reservation-cmpy5j8v70068iaecnybvds3e", "status": "PENDING", "details": {"Room": "Pantry 2", "Status": "PENDING", "Created": "Jun 3, 2026 10:18 PM", "Purpose": "test", "Schedule": "Jun 5, 2026 (morning)", "Requester": "Claudevan A. Macabale"}, "requestType": "Room Reservation"}	\N	2026-06-03 14:18:34.549	2026-06-03 14:18:34.549	\N
cmpy5k353006kiaeca47zi81q	cmpplfuam0004iazwz8vdat1x	\N	REQUEST_NOTIFICATION	Room Reservation submitted by Claudevan A. Macabale for Training Room.	RoomReservation	cmpy5k34e006fiaeck4wowo3u	{"href": "/room-reservations/admin#room-reservation-cmpy5k34e006fiaeck4wowo3u", "status": "PENDING", "details": {"Room": "Training Room", "Status": "PENDING", "Created": "Jun 3, 2026 10:19 PM", "Purpose": "test", "Schedule": "Jun 8, 2026", "Requester": "Claudevan A. Macabale"}, "requestType": "Room Reservation"}	\N	2026-06-03 14:19:13.768	2026-06-03 14:19:13.768	\N
cmpy6irdw009miaec2tl9j45s	cmpplfuam0004iazwz8vdat1x	cmplkm5x70000iaeg6ej70tgq	REQUEST_STATUS_UPDATE	Room reservation approved by S-Rank Admin-kun. Room Reservation is now APPROVED.	RoomReservation	cmpy5k34e006fiaeck4wowo3u	{"href": "/room-reservations/admin#room-reservation-cmpy5k34e006fiaeck4wowo3u", "status": "APPROVED", "details": {"Room": "Training Room", "Status": "APPROVED", "Updated": "Jun 3, 2026 10:46 PM", "Schedule": "Jun 8, 2026", "Requester": "Claudevan A. Macabale"}, "actorName": "S-Rank Admin-kun", "actionLabel": "Room reservation approved", "requestType": "Room Reservation"}	\N	2026-06-03 14:46:11.493	2026-06-03 14:46:11.493	\N
cmpy6it88009tiaecbdvwpaj2	cmpplfuam0004iazwz8vdat1x	cmplkm5x70000iaeg6ej70tgq	REQUEST_STATUS_UPDATE	Room reservation approved by S-Rank Admin-kun. Room Reservation is now APPROVED.	RoomReservation	cmpy5j8v70068iaecnybvds3e	{"href": "/room-reservations/admin#room-reservation-cmpy5j8v70068iaecnybvds3e", "status": "APPROVED", "details": {"Room": "Pantry 2", "Status": "APPROVED", "Updated": "Jun 3, 2026 10:46 PM", "Schedule": "Jun 5, 2026 (morning)", "Requester": "Claudevan A. Macabale"}, "actorName": "S-Rank Admin-kun", "actionLabel": "Room reservation approved", "requestType": "Room Reservation"}	\N	2026-06-03 14:46:13.881	2026-06-03 14:46:13.881	\N
cmpy6iuwg00a0iaecynuxl7gb	cmpplfuam0004iazwz8vdat1x	cmplkm5x70000iaeg6ej70tgq	REQUEST_STATUS_UPDATE	Room reservation approved by S-Rank Admin-kun. Room Reservation is now APPROVED.	RoomReservation	cmpy5igz80061iaecxylz0rmu	{"href": "/room-reservations/admin#room-reservation-cmpy5igz80061iaecxylz0rmu", "status": "APPROVED", "details": {"Room": "Pantry 1", "Status": "APPROVED", "Updated": "Jun 3, 2026 10:46 PM", "Schedule": "Jun 4, 2026 - Jun 5, 2026", "Requester": "Claudevan A. Macabale"}, "actorName": "S-Rank Admin-kun", "actionLabel": "Room reservation approved", "requestType": "Room Reservation"}	\N	2026-06-03 14:46:16.048	2026-06-03 14:46:16.048	\N
cmpy8kqj700afiaec2t141wab	cmpplfuam0004iazwz8vdat1x	cmplkm5x70000iaeg6ej70tgq	REQUEST_STATUS_UPDATE	Room reservation approved by S-Rank Admin-kun. Room Reservation is now APPROVED.	RoomReservation	cmpy5igz80061iaecxylz0rmu	{"href": "/room-reservations/admin#room-reservation-cmpy5igz80061iaecxylz0rmu", "status": "APPROVED", "details": {"Room": "Pantry 1", "Status": "APPROVED", "Updated": "Jun 3, 2026 11:43 PM", "Schedule": "Jun 4, 2026 - Jun 5, 2026", "Requester": "Claudevan A. Macabale"}, "actorName": "S-Rank Admin-kun", "actionLabel": "Room reservation approved", "requestType": "Room Reservation"}	\N	2026-06-03 15:43:42.931	2026-06-03 15:43:42.931	\N
cmpy92z3k00aoiaec0dz5cioe	cmpplfuam0004iazwz8vdat1x	cmplkm5x70000iaeg6ej70tgq	REQUEST_STATUS_UPDATE	Room reservation approved by S-Rank Admin-kun. Room Reservation is now APPROVED.	RoomReservation	cmpy5igz80061iaecxylz0rmu	{"href": "/room-reservations/admin#room-reservation-cmpy5igz80061iaecxylz0rmu", "status": "APPROVED", "details": {"Room": "Pantry 1", "Status": "APPROVED", "Updated": "Jun 3, 2026 11:57 PM", "Schedule": "Jun 4, 2026 - Jun 5, 2026", "Requester": "Claudevan A. Macabale"}, "actorName": "S-Rank Admin-kun", "actionLabel": "Room reservation approved", "requestType": "Room Reservation"}	\N	2026-06-03 15:57:53.841	2026-06-03 15:57:53.841	\N
cmpy9rbfx00bliaec7eo2rhfo	cmpplfuam0004iazwz8vdat1x	\N	REQUEST_NOTIFICATION	Vehicle Request submitted by Claudevan A. Macabale for Jun 5, 2026 to Sugbongcogon, Misamis Oriental, Talisayan, Misamis Oriental, Magsaysay, Misamis Oreintal.	VehicleRequest	cmpy9rbat00b7iaecdd6xlwz4	{"href": "/vehicle-requests/admin?review=cmpy9rbat00b7iaecdd6xlwz4#vehicle-request-cmpy9rbat00b7iaecdd6xlwz4", "status": "PENDING", "details": {"Status": "PENDING", "Created": "Jun 4, 2026 12:16 AM", "Purpose": "Supervisionaryefewgtrwk;gkrwgk;tkg;2g;2;gdgdegf", "Requester": "Claudevan A. Macabale", "Destination": "Sugbongcogon, Misamis Oriental, Talisayan, Misamis Oriental, Magsaysay, Misamis Oreintal", "Travel date": "Jun 5, 2026"}, "requestType": "Vehicle Request"}	\N	2026-06-03 16:16:49.581	2026-06-03 16:58:39.785	\N
cmpyaouk9000fia20r5ortirm	cmpplfuam0004iazwz8vdat1x	\N	REQUEST_NOTIFICATION	Vehicle Request submitted by Claudevan A. Macabale for Jun 10, 2026 to etetetetette.	VehicleRequest	cmpyaoujo0008ia20ealxdgtc	{"href": "/vehicle-requests/admin?review=cmpyaoujo0008ia20ealxdgtc#vehicle-request-cmpyaoujo0008ia20ealxdgtc", "status": "PENDING", "details": {"Status": "PENDING", "Created": "Jun 4, 2026 12:42 AM", "Purpose": "test", "Requester": "Claudevan A. Macabale", "Destination": "etetetetette", "Travel date": "Jun 10, 2026"}, "requestType": "Vehicle Request"}	\N	2026-06-03 16:42:54.01	2026-06-03 16:58:39.79	\N
cmpyawy4t001via20tr4pocsc	cmpplfuam0004iazwz8vdat1x	\N	REQUEST_NOTIFICATION	Vehicle Request submitted by Claudevan A. Macabale for Jun 10, 2026 to etetetetette.	VehicleRequest	cmpyawy4b001qia20ts4s8t84	{"href": "/vehicle-requests/admin?review=cmpyawy4b001qia20ts4s8t84#vehicle-request-cmpyawy4b001qia20ts4s8t84", "status": "PENDING", "details": {"Status": "PENDING", "Created": "Jun 4, 2026 12:49 AM", "Purpose": "htrhtr", "Requester": "Claudevan A. Macabale", "Destination": "etetetetette", "Travel date": "Jun 10, 2026"}, "requestType": "Vehicle Request"}	\N	2026-06-03 16:49:11.885	2026-06-03 16:58:39.791	\N
cmpyao80c0004ia204pu51xpz	cmpplfuam0004iazwz8vdat1x	cmplkm5x70000iaeg6ej70tgq	REQUEST_STATUS_UPDATE	Approved by S-Rank Admin-kun. Vehicle Request is now APPROVED.	VehicleRequest	cmpy9rbat00b7iaecdd6xlwz4	{"href": "/vehicle-requests/admin?review=cmpy9rbat00b7iaecdd6xlwz4#vehicle-request-cmpy9rbat00b7iaecdd6xlwz4", "status": "APPROVED", "details": {"Status": "APPROVED", "Updated": "Jun 4, 2026 12:42 AM", "Vehicle": "Isuzu D-Max (SAB-6469)", "Requester": "Claudevan A. Macabale", "SO number": "Pending assignment", "Destination": "Sugbongcogon, Misamis Oriental, Talisayan, Misamis Oriental, Magsaysay, Misamis Oreintal", "Travel date": "Jun 5, 2026"}, "actorName": "S-Rank Admin-kun", "actionLabel": "Approved", "requestType": "Vehicle Request"}	\N	2026-06-03 16:42:24.78	2026-06-03 16:58:39.794	\N
cmpyawah3001kia20fv3pdm1a	cmpplfuam0004iazwz8vdat1x	cmplkm5x70000iaeg6ej70tgq	REQUEST_STATUS_UPDATE	Approved by S-Rank Admin-kun. Vehicle Request is now APPROVED.	VehicleRequest	cmpyaoujo0008ia20ealxdgtc	{"href": "/vehicle-requests/admin?review=cmpyaoujo0008ia20ealxdgtc#vehicle-request-cmpyaoujo0008ia20ealxdgtc", "status": "APPROVED", "details": {"Status": "APPROVED", "Updated": "Jun 4, 2026 12:48 AM", "Vehicle": "Toyota HiAce (SNA-9905)", "Requester": "Claudevan A. Macabale", "SO number": "Pending assignment", "Destination": "etetetetette", "Travel date": "Jun 10, 2026"}, "actorName": "S-Rank Admin-kun", "actionLabel": "Approved", "requestType": "Vehicle Request"}	\N	2026-06-03 16:48:41.223	2026-06-03 16:58:39.796	\N
cmpybqypk000uiaukxju7v9t0	cmpplfuam0004iazwz8vdat1x	cmplkm5x70000iaeg6ej70tgq	REQUEST_STATUS_UPDATE	Rejected by S-Rank Admin-kun. Vehicle Request is now REJECTED.	VehicleRequest	cmpyawy4b001qia20ts4s8t84	{"href": "/vehicle-requests/admin?review=cmpyawy4b001qia20ts4s8t84#vehicle-request-cmpyawy4b001qia20ts4s8t84", "status": "REJECTED", "details": {"Status": "REJECTED", "Updated": "Jun 4, 2026 1:12 AM", "Vehicle": "Pending assignment", "Requester": "Claudevan A. Macabale", "SO number": "Pending assignment", "Destination": "etetetetette", "Travel date": "Jun 10, 2026"}, "actorName": "S-Rank Admin-kun", "actionLabel": "Rejected", "requestType": "Vehicle Request"}	\N	2026-06-03 17:12:32.312	2026-06-03 17:12:32.312	\N
cmpybqyps000ziaukeac625r0	cmpybqypk000viauky826e3ut	cmplkm5x70000iaeg6ej70tgq	REQUEST_STATUS_UPDATE	Your Vehicle Request for Jun 10, 2026 to etetetetette was rejected. Reason: wlay sakyanan	VehicleRequest	cmpyawy4b001qia20ts4s8t84	{"href": "/vehicle-requests#vehicle-request-cmpyawy4b001qia20ts4s8t84", "status": "REJECTED", "details": {"Reason": "wlay sakyanan", "Status": "REJECTED", "Updated": "Jun 4, 2026 1:12 AM", "Vehicle": "Pending assignment", "Requester": "Claudevan A. Macabale", "SO number": "Pending assignment", "Destination": "etetetetette", "Travel date": "Jun 10, 2026"}, "actorName": "S-Rank Admin-kun", "actionLabel": "Rejected", "requestType": "Vehicle Request"}	\N	2026-06-03 17:12:32.321	2026-06-03 17:12:32.321	\N
cmpz8mea1000aiajcmtsr05tm	cmpz8mb020005iajc07srqp9j	cmpp3gnhz0007iafkfwlwufi4	USER_MESSAGE	Boss	\N	\N	\N	\N	2026-06-04 08:32:46.538	2026-06-04 08:32:46.538	\N
cmq1zkzf20174iaqownr00hzp	cmpz8mb020005iajc07srqp9j	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	test	\N	\N	\N	\N	2026-06-06 06:43:02.603	2026-06-06 06:43:02.603	\N
cmq1zvkky018kiaqorxwjuhjo	cmq1zva1i018diaqouipq63ao	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	test	\N	\N	\N	\N	2026-06-06 06:51:16.594	2026-06-06 06:51:16.594	\N
cmq2lgurj02ediaqo9net6g81	cmpz8mb020005iajc07srqp9j	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	test	\N	\N	\N	\N	2026-06-06 16:55:41.498	2026-06-06 16:55:41.498	\N
cmq3eoa9p0090ia2g5vn8206x	cmq3eo7fq008via2gvj7q5fob	cmpp3gnhz0007iafkfwlwufi4	USER_MESSAGE	Hi	\N	\N	\N	\N	2026-06-07 06:33:17.053	2026-06-07 06:33:17.053	\N
cmq3frs6s001uiassdrx2ry13	cmpz8mb020005iajc07srqp9j	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	hui	\N	\N	\N	\N	2026-06-07 07:03:59.861	2026-06-07 07:03:59.861	\N
cmq3fw5lw002giassm1rb8d87	cmpz8mb020005iajc07srqp9j	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	halo	\N	\N	\N	\N	2026-06-07 07:07:23.876	2026-06-07 07:07:23.876	\N
cmq3g96j8007xiasscn3ov21t	cmpz8mb020005iajc07srqp9j	cmpp3gnhz0007iafkfwlwufi4	USER_MESSAGE	gfgfhrrgerhehehehethethethethethethethbtbrthrhr	\N	\N	\N	\N	2026-06-07 07:17:31.604	2026-06-07 07:17:31.604	\N
cmq3hcnos00n8iass3xtdwbgm	cmppllr48000wiazw1pq1dc37	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	Internet is now working!	\N	\N	\N	\N	2026-06-07 07:48:13.42	2026-06-07 07:48:13.42	\N
cmq3hdu9f00o7iassetpls40p	cmppllr48000wiazw1pq1dc37	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	PSA IOMS Vehicle Request Module is currently down	\N	\N	\N	\N	2026-06-07 07:49:08.595	2026-06-07 07:49:08.595	\N
cmq3heh6w00owiassdtl6p5hh	cmppllr48000wiazw1pq1dc37	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	Test	\N	\N	\N	\N	2026-06-07 07:49:38.312	2026-06-07 07:49:38.312	\N
cmq3hf66t00pjiassbk870svt	cmppllr48000wiazw1pq1dc37	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	Happy New Year!	\N	\N	\N	\N	2026-06-07 07:50:10.709	2026-06-07 07:50:10.709	\N
cmq4nzmgv002uia90nynxgi5b	cmq4nzk4c002hia90rvlqemr8	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	pssst	\N	\N	\N	\N	2026-06-08 03:41:48.799	2026-06-08 03:41:48.799	\N
cmqgfz92a000yiaqoyfoebcl5	cmpz8mb020005iajc07srqp9j	cmplkm5x70000iaeg6ej70tgq	USER_MESSAGE	test	\N	\N	\N	\N	2026-06-16 09:30:48.608	2026-06-16 09:30:48.608	cmpz8mea1000aiajcmtsr05tm
\.


--
-- Data for Name: ChatMessageRead; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatMessageRead" (id, "messageId", "userId", "readAt") FROM stdin;
cmptylosr00duialo4ajhub5v	cmptylos800dsialofw9eewqn	cmplkm5x70000iaeg6ej70tgq	2026-05-31 15:53:26.475
cmptyno7000efialoha94gj8m	cmptylos800dsialofw9eewqn	cmpp3gnhz0007iafkfwlwufi4	2026-05-31 15:54:59.004
cmptyogkt00eoialon7gxt5km	cmptyogkl00emialo6lhnh3aq	cmpp3gnhz0007iafkfwlwufi4	2026-05-31 15:55:35.789
cmptyojho00erialoemhe74y1	cmptyogkl00emialo6lhnh3aq	cmplkm5x70000iaeg6ej70tgq	2026-05-31 15:55:39.565
cmptza5s300imialoh3th9lzy	cmptza5rw00ikialoo0n6jg0q	cmpp3gnhz0007iafkfwlwufi4	2026-05-31 16:12:28.227
cmptzab5s00ipialozyj92nox	cmptza5rw00ikialoo0n6jg0q	cmplkm5x70000iaeg6ej70tgq	2026-05-31 16:12:35.2
cmptzb1a300ivialoknp10tw0	cmptzb19v00itialomgkqfwfw	cmplkm5x70000iaeg6ej70tgq	2026-05-31 16:13:09.051
cmptzb1ly00j1ialopvm9vw6j	cmptzb19v00itialomgkqfwfw	cmpp3gnhz0007iafkfwlwufi4	2026-05-31 16:13:09.478
cmptzbbe200jjialov6r6dvhb	cmptzbbdw00jhialowgxlnyjt	cmpp3gnhz0007iafkfwlwufi4	2026-05-31 16:13:22.155
cmptzbujg00jpialoytvkffkq	cmptzbbdw00jhialowgxlnyjt	cmplkm5x70000iaeg6ej70tgq	2026-05-31 16:13:46.972
cmptzbx2u00juialoi8fyutnz	cmptzbx2o00jsialo3lw8by0t	cmpp3gnhz0007iafkfwlwufi4	2026-05-31 16:13:50.263
cmptzc4em00jwialo1ei5e0je	cmptzbx2o00jsialo3lw8by0t	cmplkm5x70000iaeg6ej70tgq	2026-05-31 16:13:59.759
cmpxh9v3z0006iat0nxyweu2w	cmpxh9v3n0004iat0n7aovv6f	cmplkm5x70000iaeg6ej70tgq	2026-06-03 02:59:26.016
cmpxhko4c0013iat0am7vu1yy	cmpxh9v3n0004iat0n7aovv6f	cmpp3gnhz0007iafkfwlwufi4	2026-06-03 03:07:50.172
cmpxhyfbo000hia30ksjei7kf	cmpxhyfbf000fia30m7c9lsjm	cmplkm5x70000iaeg6ej70tgq	2026-06-03 03:18:31.957
cmpxhyj3h000kia30wgrz06nw	cmpxhyfbf000fia30m7c9lsjm	cmpp3gnhz0007iafkfwlwufi4	2026-06-03 03:18:36.846
cmpxnahfv005pia30vg3x9fuj	cmpxnahfm005mia30d9f7d7o1	cmplkm5x70000iaeg6ej70tgq	2026-06-03 05:47:52.651
cmpxnk22m006uia30dmpoeac9	cmpxnk22g006ria30zrsevc9v	cmplkm5x70000iaeg6ej70tgq	2026-06-03 05:55:19.295
cmpxnph0i007ria30vlquq39i	cmpxnahfm005mia30d9f7d7o1	cmpp3gnhz0007iafkfwlwufi4	2026-06-03 05:59:31.939
cmpxnph0i007sia303mgb8hlh	cmpxnk22g006ria30zrsevc9v	cmpp3gnhz0007iafkfwlwufi4	2026-06-03 05:59:31.939
cmpxol0im000viap4w9n2f8bj	cmpxol0ia000siap4eyt26ar0	cmpp3gnhz0007iafkfwlwufi4	2026-06-03 06:24:03.549
cmpxolgak000xiap4cr4t78q1	cmpxol0ia000siap4eyt26ar0	cmplkm5x70000iaeg6ej70tgq	2026-06-03 06:24:23.997
cmpy45qr1002eiaec4xk0n21h	cmpy1jia40004ia306rhmk9s1	cmplkm5x70000iaeg6ej70tgq	2026-06-03 13:40:04.91
cmpybrekq0014iauk6ra2t67w	cmpybqyps000ziaukeac625r0	cmpp3gnhz0007iafkfwlwufi4	2026-06-03 17:12:52.874
cmpz8mea8000ciajcsqpxhteg	cmpz8mea1000aiajcmtsr05tm	cmpp3gnhz0007iafkfwlwufi4	2026-06-04 08:32:46.544
cmq1zk9p6016xiaqo0vmh860p	cmpz8mea1000aiajcmtsr05tm	cmplkm5x70000iaeg6ej70tgq	2026-06-06 06:42:29.272
cmq1zkzf90176iaqoyoo0wokp	cmq1zkzf20174iaqownr00hzp	cmplkm5x70000iaeg6ej70tgq	2026-06-06 06:43:02.614
cmq1zvkl7018miaqogm60b6qx	cmq1zvkky018kiaqorxwjuhjo	cmplkm5x70000iaeg6ej70tgq	2026-06-06 06:51:16.603
cmq2lgury02efiaqo6yrg66bg	cmq2lgurj02ediaqo9net6g81	cmplkm5x70000iaeg6ej70tgq	2026-06-06 16:55:41.518
cmq3eoaa50092ia2g5qzprgvm	cmq3eoa9p0090ia2g5vn8206x	cmpp3gnhz0007iafkfwlwufi4	2026-06-07 06:33:17.07
cmq3frenb001oiasso1ahxeqh	cmq1zkzf20174iaqownr00hzp	cmpp3gnhz0007iafkfwlwufi4	2026-06-07 07:03:42.312
cmq3frenb001piassh4pgli0m	cmq2lgurj02ediaqo9net6g81	cmpp3gnhz0007iafkfwlwufi4	2026-06-07 07:03:42.312
cmq3frs71001wiassn0bu3n3c	cmq3frs6s001uiassdrx2ry13	cmplkm5x70000iaeg6ej70tgq	2026-06-07 07:03:59.869
cmq3fw5m4002iiasshkj994lj	cmq3fw5lw002giassm1rb8d87	cmplkm5x70000iaeg6ej70tgq	2026-06-07 07:07:23.884
cmq3fwa11002niassbekuo57j	cmq3frs6s001uiassdrx2ry13	cmpp3gnhz0007iafkfwlwufi4	2026-06-07 07:07:29.606
cmq3fwa11002oiasshbbx71uk	cmq3fw5lw002giassm1rb8d87	cmpp3gnhz0007iafkfwlwufi4	2026-06-07 07:07:29.606
cmq3g96jd007ziassoq7sx7r3	cmq3g96j8007xiasscn3ov21t	cmpp3gnhz0007iafkfwlwufi4	2026-06-07 07:17:31.609
cmq3g99q40085iass0tjyz0by	cmq3g96j8007xiasscn3ov21t	cmplkm5x70000iaeg6ej70tgq	2026-06-07 07:17:35.74
cmq3hcnoz00naiassctnj7yh6	cmq3hcnos00n8iass3xtdwbgm	cmplkm5x70000iaeg6ej70tgq	2026-06-07 07:48:13.428
cmq3hdu9n00o9iassmdik572k	cmq3hdu9f00o7iassetpls40p	cmplkm5x70000iaeg6ej70tgq	2026-06-07 07:49:08.604
cmq3heh7100oyiass6irxay1d	cmq3heh6w00owiassdtl6p5hh	cmplkm5x70000iaeg6ej70tgq	2026-06-07 07:49:38.317
cmq3hf66z00pliassxknlmwzb	cmq3hf66t00pjiassbk870svt	cmplkm5x70000iaeg6ej70tgq	2026-06-07 07:50:10.715
cmq4nzmh3002wia90d1pr3b2e	cmq4nzmgv002uia90nynxgi5b	cmplkm5x70000iaeg6ej70tgq	2026-06-08 03:41:48.807
cmqgfz92i0010iaqojol5t0e2	cmqgfz92a000yiaqoyfoebcl5	cmplkm5x70000iaeg6ej70tgq	2026-06-16 09:30:48.618
\.


--
-- Data for Name: ChatReaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ChatReaction" (id, "messageId", "userId", emoji, "customEmojiId", "createdAt") FROM stdin;
cmpxi4k13001nia308ud2jwm0	cmptza5rw00ikialoo0n6jg0q	cmplkm5x70000iaeg6ej70tgq	😡	\N	2026-06-03 03:23:17.991
cmq2mxflm003oia08k0pskz59	cmpz8mea1000aiajcmtsr05tm	cmplkm5x70000iaeg6ej70tgq	😡	\N	2026-06-06 17:36:34.618
\.


--
-- Data for Name: ConvocationAssignmentHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ConvocationAssignmentHistory" (id, "programId", "groupId", "personnelId", "itemKey", "rotationKey", "convocationDate", "wasOverride", "countedInRotation", "createdAt") FROM stdin;
cmpqdpirs001lia4wrjgapbl2	cmpp8tlnp0005iap48q5qcc4q	convocation_group_2	cmpmbbun40051iaus0ypzmgo0	flag_pledge	flag_pledge	2026-05-31 16:00:00	f	t	2026-05-29 03:45:14.823
cmpqdpirs001nia4wkfe3zyvz	cmpp8tlnp0005iap48q5qcc4q	convocation_group_2	cmpm71afq0031iausuxhheoyf	lingkod_bayan_pledge	lingkod_bayan_pledge	2026-05-31 16:00:00	f	t	2026-05-29 03:45:14.823
cmpqdpirs001pia4wztc1k6h7	cmpp8tlnp0005iap48q5qcc4q	convocation_group_2	cmpm7rduc003iiausmprulwf1	national_anthem	national_anthem_and_emcee	2026-05-31 16:00:00	f	t	2026-05-29 03:45:14.823
cmpqdpirt001ria4wuzi4isu0	cmpp8tlnp0005iap48q5qcc4q	convocation_group_2	cmpmcug27005hiauszp8pd7lt	psa_vision_mission_values	psa_vision_mission_values	2026-05-31 16:00:00	t	t	2026-05-29 03:45:14.823
cmpqdpiru001tia4wb3735tz9	cmpp8tlnp0005iap48q5qcc4q	convocation_group_2	cmpm6jzck002siausjij512h3	quality_policy	quality_policy	2026-05-31 16:00:00	f	t	2026-05-29 03:45:14.823
cmq0bedas0001iaqo89ia5uwh	cmpqdqdfa001xia4wa2udfmxm	convocation_group_3	cmpmain42004fiaus2twkusb1	flag_pledge	flag_pledge	2026-06-14 16:00:00	f	t	2026-06-05 02:38:17.039
cmq0bedas0003iaqoncmilqzr	cmpqdqdfa001xia4wa2udfmxm	convocation_group_3	cmpmanuku004yiaush28acnzm	lingkod_bayan_pledge	lingkod_bayan_pledge	2026-06-14 16:00:00	f	t	2026-06-05 02:38:17.039
cmq0bedat0005iaqozhvmj9pi	cmpqdqdfa001xia4wa2udfmxm	convocation_group_3	cmpmczbk0005wiausmycr3jbp	national_anthem	national_anthem_and_emcee	2026-06-14 16:00:00	f	t	2026-06-05 02:38:17.039
cmq0bedat0007iaqo9i4ytuwa	cmpqdqdfa001xia4wa2udfmxm	convocation_group_3	cmpmcyll0005tiaus9udmpd06	psa_vision_mission_values	psa_vision_mission_values	2026-06-14 16:00:00	f	t	2026-06-05 02:38:17.039
cmq0bedat0009iaqo7o3mbrsy	cmpqdqdfa001xia4wa2udfmxm	convocation_group_3	cmpma9o460043iausnsgkdz9b	quality_policy	quality_policy	2026-06-14 16:00:00	f	t	2026-06-05 02:38:17.039
cmqnji2va001wia9gxk7jzmzh	cmqnjeztm000lia9ge2bj8bwb	convocation_group_1	cmpm70pwb002yiaus2m2fx6w0	flag_pledge	flag_pledge	2026-06-21 16:00:00	f	t	2026-06-21 08:43:49.125
cmqnji2vb001yia9gyaufdm1j	cmqnjeztm000lia9ge2bj8bwb	convocation_group_1	cmpm6z80v002viausbcqx3ozw	lingkod_bayan_pledge	lingkod_bayan_pledge	2026-06-21 16:00:00	f	t	2026-06-21 08:43:49.125
cmqnji2vb0020ia9gsyyibe6a	cmqnjeztm000lia9ge2bj8bwb	convocation_group_1	cmpmackhz004ciausks7jgn0o	national_anthem	national_anthem_and_emcee	2026-06-21 16:00:00	f	t	2026-06-21 08:43:49.125
cmqnji2vb0022ia9grgo4u0qk	cmqnjeztm000lia9ge2bj8bwb	convocation_group_1	cmpmcwkjj005niausxhpwr0rq	psa_vision_mission_values	psa_vision_mission_values	2026-06-21 16:00:00	f	t	2026-06-21 08:43:49.125
cmqnji2vc0024ia9goi3ldel9	cmqnjeztm000lia9ge2bj8bwb	convocation_group_1	cmpm7s7j8003liauswjjxk8ex	quality_policy	quality_policy	2026-06-21 16:00:00	f	t	2026-06-21 08:43:49.125
cmqut59zv007fia7cpst7m9bf	cmqtbvors009oiagwjoffk4mq	convocation_group_2	cmpm6jzck002siausjij512h3	flag_pledge	flag_pledge	2026-06-28 16:00:00	f	t	2026-06-26 10:48:11.226
cmqut59zv007hia7c943w9023	cmqtbvors009oiagwjoffk4mq	convocation_group_2	cmpm9wtav0040iaus5stdmg52	lingkod_bayan_pledge	lingkod_bayan_pledge	2026-06-28 16:00:00	f	t	2026-06-26 10:48:11.226
cmqut59zv007jia7cx9nvbpuk	cmqtbvors009oiagwjoffk4mq	convocation_group_2	cmpm7sv69003oiausjksd398m	psa_vision_mission_values	psa_vision_mission_values	2026-06-28 16:00:00	t	t	2026-06-26 10:48:11.226
cmqut59zv007lia7c2ytwxfp0	cmqtbvors009oiagwjoffk4mq	convocation_group_2	cmpm7rduc003iiausmprulwf1	quality_policy	quality_policy	2026-06-28 16:00:00	t	t	2026-06-26 10:48:11.226
cmr0ntvez00mfiaocrnbs7p3b	cmr0nlmm500g3iaociu1cnhk2	convocation_group_3	cmpmanuku004yiaush28acnzm	flag_pledge	flag_pledge	2026-07-05 16:00:00	f	t	2026-06-30 13:05:58.09
cmr0ntvf000mhiaoczlpsj26a	cmr0nlmm500g3iaociu1cnhk2	convocation_group_3	cmpmain42004fiaus2twkusb1	lingkod_bayan_pledge	lingkod_bayan_pledge	2026-07-05 16:00:00	f	t	2026-06-30 13:05:58.09
cmr0ntvf000mjiaocfqszkul5	cmr0nlmm500g3iaociu1cnhk2	convocation_group_3	cmpmd0y8g005ziausnc38ns1g	psa_vision_mission_values	psa_vision_mission_values	2026-07-05 16:00:00	f	t	2026-06-30 13:05:58.09
cmr0ntvf000mliaoctydqxnxj	cmr0nlmm500g3iaociu1cnhk2	convocation_group_3	cmpmcyll0005tiaus9udmpd06	quality_policy	quality_policy	2026-07-05 16:00:00	f	t	2026-06-30 13:05:58.09
\.


--
-- Data for Name: ConvocationGroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ConvocationGroup" (id, name, "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
convocation_group_1	Group 1	1	t	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
convocation_group_2	Group 2	2	t	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
convocation_group_3	Group 3	3	t	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
\.


--
-- Data for Name: ConvocationGroupMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ConvocationGroupMember" (id, "groupId", "personnelId", "isTechnicalPerson", "isGroupLead", "isActive", "createdAt", "updatedAt", "isAvailable") FROM stdin;
cmpp63nb1001hiavsww6zzdgv	convocation_group_1	cmpm71afq0031iausuxhheoyf	f	f	f	2026-05-28 07:24:30.782	2026-05-28 08:14:07.864	t
cmpp63tel001liavse5tsxmig	convocation_group_1	cmpm7sv69003oiausjksd398m	f	f	f	2026-05-28 07:24:38.685	2026-05-28 08:14:07.864	t
cmpp7lvoy000pialkir8es27b	convocation_group_2	cmpm7rduc003iiausmprulwf1	f	f	t	2026-05-28 08:06:41.074	2026-05-28 08:08:42.077	t
cmpp7mz79000tialk6ovurw7e	convocation_group_2	cmpmcug27005hiauszp8pd7lt	f	f	t	2026-05-28 08:07:32.278	2026-05-28 08:08:42.077	t
cmpp7nbmg000xialk72a9un6t	convocation_group_2	cmpmcxxg5005qiausn9g2slk7	f	f	t	2026-05-28 08:07:48.376	2026-05-28 08:08:42.077	t
cmpp7nfqq0011ialkuj5jjv0u	convocation_group_2	cmpmbbun40051iaus0ypzmgo0	f	f	t	2026-05-28 08:07:53.714	2026-05-28 08:08:42.077	t
cmpp62r2g001diavs55q1ml5d	convocation_group_2	cmpm6jzck002siausjij512h3	f	f	t	2026-05-28 07:23:49	2026-05-28 08:08:42.077	t
cmpp6gfwb002jiavsryg1qicy	convocation_group_2	cmpm71afq0031iausuxhheoyf	f	f	t	2026-05-28 07:34:27.708	2026-05-28 08:08:42.077	t
cmpp64s5w002diavsjclp67le	convocation_group_2	cmpmaayyh0049iausqyybqoai	t	f	t	2026-05-28 07:25:23.732	2026-05-28 08:08:42.077	t
cmpp5ym4v0009iavs2l66v6n3	convocation_group_1	cmpm7wjyu003riaus32ihl37b	f	f	t	2026-05-28 07:20:35.983	2026-05-28 08:14:07.864	f
cmpp5y1c20001iavswnlk9g7q	convocation_group_1	cmpm6z80v002viausbcqx3ozw	f	f	t	2026-05-28 07:20:09.026	2026-05-28 08:14:07.864	t
cmpp5ygry0005iavszugd8qyc	convocation_group_1	cmpm7s7j8003liauswjjxk8ex	f	f	t	2026-05-28 07:20:29.039	2026-05-28 08:14:07.864	t
cmpp5ytfw000diavs3l0qjvvb	convocation_group_1	cmpmamcwq004viaus5y4atq5q	f	f	t	2026-05-28 07:20:45.453	2026-05-28 08:14:07.864	t
cmpp5z6am000liavsnyozcdn3	convocation_group_1	cmpmackhz004ciausks7jgn0o	f	f	t	2026-05-28 07:21:02.11	2026-05-28 08:14:07.864	t
cmpp60dxv000piavs6mbey1qa	convocation_group_1	cmpmakc8i004liaus6oylw747	f	f	t	2026-05-28 07:21:58.675	2026-05-28 08:14:07.864	t
cmpp60j0l000tiavsa62ofly7	convocation_group_1	cmpmcwkjj005niausxhpwr0rq	f	f	t	2026-05-28 07:22:05.253	2026-05-28 08:14:07.864	t
cmpp60omz000xiavs833gvfu9	convocation_group_1	cmpm70pwb002yiaus2m2fx6w0	f	f	t	2026-05-28 07:22:12.539	2026-05-28 08:14:07.864	t
cmpp613cq0011iavs93c447pj	convocation_group_1	cmpmctto9005eiaus7jv5w8sw	f	f	t	2026-05-28 07:22:31.61	2026-05-28 08:14:07.864	t
cmpp61llq0015iavsjyr9e17j	convocation_group_1	cmpmcsydy005biaus8mz8wrn4	f	f	t	2026-05-28 07:22:55.263	2026-05-28 08:14:07.864	t
cmpp627n70019iavskeseluyv	convocation_group_1	cmpmcmiud0058iaustuwfw2sp	f	f	t	2026-05-28 07:23:23.828	2026-05-28 08:14:07.864	t
cmpp5yz69000hiavs0c976igm	convocation_group_1	cmpmaaekm0046iausrahtxbtp	t	f	t	2026-05-28 07:20:52.881	2026-05-28 08:14:07.864	t
cmpp7cvff0005ialkbl4q2i8b	convocation_group_1	cmpm9wtav0040iaus5stdmg52	f	f	f	2026-05-28 07:59:40.827	2026-05-28 08:14:07.864	t
cmpp6gpqo002niavs9i1jkbjv	convocation_group_2	cmpm7sv69003oiausjksd398m	f	f	t	2026-05-28 07:34:40.464	2026-05-28 08:08:42.077	t
cmpp7b8790001ialkslptcvzg	convocation_group_2	cmpm7y2d5003uiaushuvnjj0w	f	f	t	2026-05-28 07:58:24.069	2026-05-28 08:08:42.077	t
cmpp7ld8e000fialkfju434gm	convocation_group_2	cmpmajetn004iiaus2vel52gz	f	f	t	2026-05-28 08:06:17.15	2026-05-28 08:08:42.077	t
cmpp7lk7p000jialk41hvi6m2	convocation_group_2	cmpm7z8kc003xiauswx84u6ek	f	f	t	2026-05-28 08:06:26.197	2026-05-28 08:08:42.077	t
cmpp7odra0019ialkmk20qzu1	convocation_group_2	cmpm9wtav0040iaus5stdmg52	f	f	t	2026-05-28 08:08:37.798	2026-05-28 08:08:42.077	t
cmpp7ozc7001fialkmfmfijyp	convocation_group_3	cmpm4p7n6001qiausf4s5ahht	f	f	t	2026-05-28 08:09:05.768	2026-05-28 08:14:20.145	t
cmpp7pg00001lialkfzv6wl7t	convocation_group_3	cmpm7p9r4003ciausxxtm77m0	f	f	t	2026-05-28 08:09:27.36	2026-05-28 08:14:20.145	t
cmpp7pkb6001pialky084zgsu	convocation_group_3	cmpm7nh3s0036iausxm44cu9t	f	f	t	2026-05-28 08:09:32.946	2026-05-28 08:14:20.145	t
cmpp7pob5001tialkeshxbi49	convocation_group_3	cmpma9o460043iausnsgkdz9b	f	f	t	2026-05-28 08:09:38.129	2026-05-28 08:14:20.145	t
cmpp7prmr001xialknllpftuu	convocation_group_3	cmpmalk2l004qiausp3pm1z6f	f	f	t	2026-05-28 08:09:42.435	2026-05-28 08:14:20.145	t
cmpp7puvd0021ialkux8h3kua	convocation_group_3	cmpmain42004fiaus2twkusb1	f	f	t	2026-05-28 08:09:46.633	2026-05-28 08:14:20.145	t
cmpp7qnbc0025ialkywk028h4	convocation_group_3	cmpm7q17h003fiausimucssfj	f	f	t	2026-05-28 08:10:23.496	2026-05-28 08:14:20.145	t
cmpp7qr750029ialk7ll03783	convocation_group_3	cmpmczbk0005wiausmycr3jbp	f	f	t	2026-05-28 08:10:28.53	2026-05-28 08:14:20.145	t
cmpp7qv91002dialkn765mq1t	convocation_group_3	cmpm7nzmm0039iauss19l621g	f	f	t	2026-05-28 08:10:33.781	2026-05-28 08:14:20.145	t
cmpp7r1u4002hialki9voa59k	convocation_group_3	cmpmcyll0005tiaus9udmpd06	f	f	t	2026-05-28 08:10:42.316	2026-05-28 08:14:20.145	t
cmpp7r3n4002lialk732577zb	convocation_group_3	cmpmanuku004yiaush28acnzm	f	f	t	2026-05-28 08:10:44.656	2026-05-28 08:14:20.145	t
cmpp7rgsn002tialk02f8fbdc	convocation_group_3	cmpmd0y8g005ziausnc38ns1g	f	f	t	2026-05-28 08:11:01.703	2026-05-28 08:14:20.145	t
cmpp7r96d002pialkwit2p2qf	convocation_group_3	cmpmcv3uk005kiausndde2tr6	t	f	t	2026-05-28 08:10:51.829	2026-05-28 08:14:20.145	t
\.


--
-- Data for Name: ConvocationProgram; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ConvocationProgram" (id, "convocationDate", "groupId", status, "generatedById", "finalizedById", "finalizedAt", "printedAt", notes, "calendarActivityId", "createdAt", "updatedAt") FROM stdin;
cmpp8tlnp0005iap48q5qcc4q	2026-05-31 16:00:00	convocation_group_2	FINALIZED	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-05-29 03:45:14.812	\N	\N	cmpp8yus5000uiap4lbw6ascn	2026-05-28 08:40:40.934	2026-05-29 03:45:14.823
cmpqdqdfa001xia4wa2udfmxm	2026-06-14 16:00:00	convocation_group_3	FINALIZED	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-06-05 02:38:17.016	\N	\N	cmq0bedc2000biaqo1aincnay	2026-05-29 03:45:54.55	2026-06-08 17:37:50.219
cmqnjeztm000lia9ge2bj8bwb	2026-06-21 16:00:00	convocation_group_1	FINALIZED	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-06-21 08:43:49.092	\N	\N	cmqnji2x00026ia9go4ipbqet	2026-06-21 08:41:25.21	2026-06-21 08:43:49.223
cmqtbvors009oiagwjoffk4mq	2026-06-28 16:00:00	convocation_group_2	FINALIZED	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-06-26 10:48:11.219	\N	\N	cmqtc1stn00ckiagwu7h5sfo6	2026-06-25 09:57:04.167	2026-06-26 10:48:11.226
cmr0nlmm500g3iaociu1cnhk2	2026-07-05 16:00:00	convocation_group_3	FINALIZED	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-06-30 13:05:58.083	\N	\N	cmr0ntuye00maiaocnulsoeel	2026-06-30 12:59:33.436	2026-06-30 13:05:58.09
\.


--
-- Data for Name: ConvocationProgramItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ConvocationProgramItem" (id, "programId", "itemKey", "itemLabel", "itemOrder", "assignmentMode", "assignedPersonnelId", "suggestedPersonnelId", "fixedTextValue", "isEnabled", "rotationKey", "mirrorOfItemKey", "countInRotation", "overrideReason", "createdAt", "updatedAt") FROM stdin;
cmpp8tlnq0007iap43dcn7twf	cmpp8tlnp0005iap48q5qcc4q	prayer	Prayer	10	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-05-28 08:40:40.934	2026-05-28 08:40:40.934
cmpp8tlnq0008iap4o8pbg5wx	cmpp8tlnp0005iap48q5qcc4q	national_anthem	Singing of National Anthem	20	ASSIGNABLE	cmpm7rduc003iiausmprulwf1	cmpm7rduc003iiausmprulwf1	\N	t	national_anthem_and_emcee	\N	t	\N	2026-05-28 08:40:40.934	2026-05-28 08:40:40.934
cmpp8tlnq0009iap4gwr6jpx8	cmpp8tlnp0005iap48q5qcc4q	bagong_pilipinas	Bagong Pilipinas Hymn	30	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-05-28 08:40:40.934	2026-05-28 08:40:40.934
cmpp8tlnq000aiap4ottq4183	cmpp8tlnp0005iap48q5qcc4q	flag_pledge	Panunumpa sa Watawat ng Pilipinas	40	ASSIGNABLE	cmpmbbun40051iaus0ypzmgo0	cmpmbbun40051iaus0ypzmgo0	\N	t	flag_pledge	\N	t	\N	2026-05-28 08:40:40.934	2026-05-28 08:40:40.934
cmpp8tlnq000biap4hewi9kfn	cmpp8tlnp0005iap48q5qcc4q	lingkod_bayan_pledge	Panunumpa ng Lingkod Bayan	50	ASSIGNABLE	cmpm71afq0031iausuxhheoyf	cmpm71afq0031iausuxhheoyf	\N	t	lingkod_bayan_pledge	\N	t	\N	2026-05-28 08:40:40.934	2026-05-28 08:40:40.934
cmpp8tlnq000diap4qfjpyffn	cmpp8tlnp0005iap48q5qcc4q	quality_policy	Quality Policy	70	ASSIGNABLE	cmpm6jzck002siausjij512h3	cmpm6jzck002siausjij512h3	\N	t	quality_policy	\N	t	\N	2026-05-28 08:40:40.934	2026-05-28 08:40:40.934
cmpp8tlnq000eiap4arnaek6o	cmpp8tlnp0005iap48q5qcc4q	message	Message	80	FIXED	\N	\N	Maria Liza M. Bigornia, Chief Statistical Specialist	t	\N	\N	f	\N	2026-05-28 08:40:40.934	2026-05-28 08:40:40.934
cmpp8tlnq000fiap4ch0c104x	cmpp8tlnp0005iap48q5qcc4q	zumba	Zumba	90	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-05-28 08:40:40.934	2026-05-28 08:40:40.934
cmpp8tlnq000giap4sbjtgs70	cmpp8tlnp0005iap48q5qcc4q	emcee	Emcee	100	MIRRORED	cmpm7rduc003iiausmprulwf1	cmpm7rduc003iiausmprulwf1	\N	t	\N	national_anthem	f	\N	2026-05-28 08:40:40.934	2026-05-28 08:40:40.934
cmpp8tlnq000ciap4i36o28m7	cmpp8tlnp0005iap48q5qcc4q	psa_vision_mission_values	PSA Vision, Mission, Core Values & Corporate Personality	60	OVERRIDDEN	cmpmcug27005hiauszp8pd7lt	cmpmcxxg5005qiausn9g2slk7	\N	t	psa_vision_mission_values	\N	t	Automatic replacement for 2026-05-31. Previous assignee could not attend.	2026-05-28 08:40:40.934	2026-05-28 09:15:49.962
cmpqdqdfa001zia4wz1ercz8c	cmpqdqdfa001xia4wa2udfmxm	prayer	Prayer	10	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-05-29 03:45:54.55	2026-05-29 03:45:54.55
cmpqdqdfa0020ia4wxkk7oiz8	cmpqdqdfa001xia4wa2udfmxm	national_anthem	Singing of National Anthem	20	ASSIGNABLE	cmpmczbk0005wiausmycr3jbp	cmpmczbk0005wiausmycr3jbp	\N	t	national_anthem_and_emcee	\N	t	\N	2026-05-29 03:45:54.55	2026-05-29 03:45:54.55
cmpqdqdfa0021ia4wmpjiq8aq	cmpqdqdfa001xia4wa2udfmxm	bagong_pilipinas	Bagong Pilipinas Hymn	30	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-05-29 03:45:54.55	2026-05-29 03:45:54.55
cmpqdqdfa0022ia4w83jr3hs9	cmpqdqdfa001xia4wa2udfmxm	flag_pledge	Panunumpa sa Watawat ng Pilipinas	40	ASSIGNABLE	cmpmain42004fiaus2twkusb1	cmpmain42004fiaus2twkusb1	\N	t	flag_pledge	\N	t	\N	2026-05-29 03:45:54.55	2026-05-29 03:45:54.55
cmpqdqdfa0023ia4w2hjhtgtl	cmpqdqdfa001xia4wa2udfmxm	lingkod_bayan_pledge	Panunumpa ng Lingkod Bayan	50	ASSIGNABLE	cmpmanuku004yiaush28acnzm	cmpmanuku004yiaush28acnzm	\N	t	lingkod_bayan_pledge	\N	t	\N	2026-05-29 03:45:54.55	2026-05-29 03:45:54.55
cmpqdqdfa0024ia4wwipt6k59	cmpqdqdfa001xia4wa2udfmxm	psa_vision_mission_values	PSA Vision, Mission, Core Values & Corporate Personality	60	ASSIGNABLE	cmpmcyll0005tiaus9udmpd06	cmpmcyll0005tiaus9udmpd06	\N	t	psa_vision_mission_values	\N	t	\N	2026-05-29 03:45:54.55	2026-05-29 03:45:54.55
cmpqdqdfa0025ia4wof6rfak3	cmpqdqdfa001xia4wa2udfmxm	quality_policy	Quality Policy	70	ASSIGNABLE	cmpma9o460043iausnsgkdz9b	cmpma9o460043iausnsgkdz9b	\N	t	quality_policy	\N	t	\N	2026-05-29 03:45:54.55	2026-05-29 03:45:54.55
cmpqdqdfa0026ia4w14eeha1l	cmpqdqdfa001xia4wa2udfmxm	message	Message	80	FIXED	\N	\N	Maria Liza M. Bigornia, Chief Statistical Specialist	t	\N	\N	f	\N	2026-05-29 03:45:54.55	2026-05-29 03:45:54.55
cmpqdqdfb0027ia4wrx3evc7k	cmpqdqdfa001xia4wa2udfmxm	zumba	Zumba	90	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-05-29 03:45:54.55	2026-05-29 03:45:54.55
cmpqdqdfb0028ia4wsp9jnukm	cmpqdqdfa001xia4wa2udfmxm	emcee	Emcee	100	MIRRORED	cmpmczbk0005wiausmycr3jbp	cmpmczbk0005wiausmycr3jbp	\N	t	\N	national_anthem	f	\N	2026-05-29 03:45:54.55	2026-05-29 03:45:54.55
cmqnjeztn000nia9gk1skeb6h	cmqnjeztm000lia9ge2bj8bwb	prayer	Prayer	10	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-06-21 08:41:25.21	2026-06-21 08:41:25.21
cmqnjeztn000oia9g8v9v0jl6	cmqnjeztm000lia9ge2bj8bwb	national_anthem	Singing of National Anthem	20	ASSIGNABLE	cmpmackhz004ciausks7jgn0o	cmpmackhz004ciausks7jgn0o	\N	t	national_anthem_and_emcee	\N	t	\N	2026-06-21 08:41:25.21	2026-06-21 08:41:25.21
cmqnjeztn000pia9gxqb9d2jq	cmqnjeztm000lia9ge2bj8bwb	bagong_pilipinas	Bagong Pilipinas Hymn	30	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-06-21 08:41:25.21	2026-06-21 08:41:25.21
cmqnjeztn000qia9gjf7si93l	cmqnjeztm000lia9ge2bj8bwb	flag_pledge	Panunumpa sa Watawat ng Pilipinas	40	ASSIGNABLE	cmpm70pwb002yiaus2m2fx6w0	cmpm70pwb002yiaus2m2fx6w0	\N	t	flag_pledge	\N	t	\N	2026-06-21 08:41:25.21	2026-06-21 08:41:25.21
cmqnjezto000ria9geudvufhn	cmqnjeztm000lia9ge2bj8bwb	lingkod_bayan_pledge	Panunumpa ng Lingkod Bayan	50	ASSIGNABLE	cmpm6z80v002viausbcqx3ozw	cmpm6z80v002viausbcqx3ozw	\N	t	lingkod_bayan_pledge	\N	t	\N	2026-06-21 08:41:25.21	2026-06-21 08:41:25.21
cmqnjezto000sia9gdwb00gtv	cmqnjeztm000lia9ge2bj8bwb	psa_vision_mission_values	PSA Vision, Mission, Core Values & Corporate Personality	60	ASSIGNABLE	cmpmcwkjj005niausxhpwr0rq	cmpmcwkjj005niausxhpwr0rq	\N	t	psa_vision_mission_values	\N	t	\N	2026-06-21 08:41:25.21	2026-06-21 08:41:25.21
cmqnjezto000tia9g5tuexqyi	cmqnjeztm000lia9ge2bj8bwb	quality_policy	Quality Policy	70	ASSIGNABLE	cmpm7s7j8003liauswjjxk8ex	cmpm7s7j8003liauswjjxk8ex	\N	t	quality_policy	\N	t	\N	2026-06-21 08:41:25.21	2026-06-21 08:41:25.21
cmqnjezto000uia9gwc6iz7az	cmqnjeztm000lia9ge2bj8bwb	message	Message	80	FIXED	\N	\N	Maria Liza M. Bigornia, Chief Statistical Specialist	t	\N	\N	f	\N	2026-06-21 08:41:25.21	2026-06-21 08:41:25.21
cmqnjezto000via9g6p0ts0xf	cmqnjeztm000lia9ge2bj8bwb	zumba	Zumba	90	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-06-21 08:41:25.21	2026-06-21 08:41:25.21
cmqnjezto000wia9gfektp2l0	cmqnjeztm000lia9ge2bj8bwb	emcee	Emcee	100	MIRRORED	cmpmackhz004ciausks7jgn0o	cmpmackhz004ciausks7jgn0o	\N	t	\N	national_anthem	f	\N	2026-06-21 08:41:25.21	2026-06-21 08:41:25.21
cmqtbvors009qiagwz9odpksf	cmqtbvors009oiagwjoffk4mq	prayer	Prayer	10	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-06-25 09:57:04.167	2026-06-25 09:57:04.167
cmqtbvors009tiagwbbos1nwf	cmqtbvors009oiagwjoffk4mq	flag_pledge	Panunumpa sa Watawat ng Pilipinas	40	ASSIGNABLE	cmpm6jzck002siausjij512h3	cmpm6jzck002siausjij512h3	\N	t	flag_pledge	\N	t	\N	2026-06-25 09:57:04.167	2026-06-25 09:57:04.167
cmqtbvors009uiagwh8umj5o2	cmqtbvors009oiagwjoffk4mq	lingkod_bayan_pledge	Panunumpa ng Lingkod Bayan	50	ASSIGNABLE	cmpm9wtav0040iaus5stdmg52	cmpm9wtav0040iaus5stdmg52	\N	t	lingkod_bayan_pledge	\N	t	\N	2026-06-25 09:57:04.167	2026-06-25 09:57:04.167
cmqtbvort009xiagwf1g69xka	cmqtbvors009oiagwjoffk4mq	message	Message	80	FIXED	\N	\N	Maria Liza M. Bigornia, Chief Statistical Specialist	t	\N	\N	f	\N	2026-06-25 09:57:04.167	2026-06-25 09:57:04.167
cmqtbvort009yiagwdjm9pcab	cmqtbvors009oiagwjoffk4mq	zumba	Zumba	90	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-06-25 09:57:04.167	2026-06-25 09:57:04.167
cmqtbvort009viagw3q207twc	cmqtbvors009oiagwjoffk4mq	psa_vision_mission_values	PSA Vision, Mission, Core Values & Corporate Personality	60	OVERRIDDEN	cmpm7sv69003oiausjksd398m	cmpm7z8kc003xiauswx84u6ek	\N	t	psa_vision_mission_values	\N	t	Automatic replacement for 2026-06-28. Previous assignee could not attend.	2026-06-25 09:57:04.167	2026-06-25 10:01:52.473
cmqtbvors009siagwyci3k415	cmqtbvors009oiagwjoffk4mq	bagong_pilipinas	Bagong Pilipinas Hymn	30	OVERRIDDEN	\N	\N	MSU-IIT Interns	t	\N	\N	f	Custom text override.	2026-06-25 09:57:04.167	2026-06-26 10:40:06.201
cmqtbvors009riagwoeiowy1x	cmqtbvors009oiagwjoffk4mq	national_anthem	Singing of National Anthem	20	OVERRIDDEN	\N	cmpm7y2d5003uiaushuvnjj0w	Aldasir Alih Abud	t	national_anthem_and_emcee	\N	t	Custom text override.	2026-06-25 09:57:04.167	2026-06-26 10:40:29.943
cmqtbvort009ziagw2cc9l9da	cmqtbvors009oiagwjoffk4mq	emcee	Emcee	100	OVERRIDDEN	\N	cmpm7y2d5003uiaushuvnjj0w	Aldasir Alih Abud	t	\N	national_anthem	f	Custom text override.	2026-06-25 09:57:04.167	2026-06-26 10:40:52.894
cmqtbvort009wiagwcs1qoxyp	cmqtbvors009oiagwjoffk4mq	quality_policy	Quality Policy	70	OVERRIDDEN	cmpm7rduc003iiausmprulwf1	cmpmajetn004iiaus2vel52gz	Aaron Allen E. Cainglet, SG 11 - Statistical Analyst	t	quality_policy	\N	t	Manual personnel replacement.	2026-06-25 09:57:04.167	2026-06-26 10:47:59.178
cmr0nlmm600g5iaockpk5kh4i	cmr0nlmm500g3iaociu1cnhk2	prayer	Prayer	10	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-06-30 12:59:33.436	2026-06-30 12:59:33.436
cmr0nlmm600g7iaocqvs7m1xd	cmr0nlmm500g3iaociu1cnhk2	bagong_pilipinas	Bagong Pilipinas Hymn	30	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-06-30 12:59:33.436	2026-06-30 12:59:33.436
cmr0nlmm600g8iaoclpbesysu	cmr0nlmm500g3iaociu1cnhk2	flag_pledge	Panunumpa sa Watawat ng Pilipinas	40	ASSIGNABLE	cmpmanuku004yiaush28acnzm	cmpmanuku004yiaush28acnzm	\N	t	flag_pledge	\N	t	\N	2026-06-30 12:59:33.436	2026-06-30 12:59:33.436
cmr0nlmm600g9iaocs6psmh3f	cmr0nlmm500g3iaociu1cnhk2	lingkod_bayan_pledge	Panunumpa ng Lingkod Bayan	50	ASSIGNABLE	cmpmain42004fiaus2twkusb1	cmpmain42004fiaus2twkusb1	\N	t	lingkod_bayan_pledge	\N	t	\N	2026-06-30 12:59:33.436	2026-06-30 12:59:33.436
cmr0nlmm600gaiaocaapl3b6l	cmr0nlmm500g3iaociu1cnhk2	psa_vision_mission_values	PSA Vision, Mission, Core Values & Corporate Personality	60	ASSIGNABLE	cmpmd0y8g005ziausnc38ns1g	cmpmd0y8g005ziausnc38ns1g	\N	t	psa_vision_mission_values	\N	t	\N	2026-06-30 12:59:33.436	2026-06-30 12:59:33.436
cmr0nlmm600gbiaocjb6kteqh	cmr0nlmm500g3iaociu1cnhk2	quality_policy	Quality Policy	70	ASSIGNABLE	cmpmcyll0005tiaus9udmpd06	cmpmcyll0005tiaus9udmpd06	\N	t	quality_policy	\N	t	\N	2026-06-30 12:59:33.436	2026-06-30 12:59:33.436
cmr0nlmm600gciaoc7m59eq8o	cmr0nlmm500g3iaociu1cnhk2	message	Message	80	FIXED	\N	\N	Maria Liza M. Bigornia, Chief Statistical Specialist	t	\N	\N	f	\N	2026-06-30 12:59:33.436	2026-06-30 12:59:33.436
cmr0nlmm600gdiaocdpri55yp	cmr0nlmm500g3iaociu1cnhk2	zumba	Zumba	90	FIXED	\N	\N	AVP	t	\N	\N	f	\N	2026-06-30 12:59:33.436	2026-06-30 12:59:33.436
cmr0nlmm600g6iaocd2trf0i2	cmr0nlmm500g3iaociu1cnhk2	national_anthem	Singing of National Anthem	20	OVERRIDDEN	\N	cmpmalk2l004qiausp3pm1z6f	Gerry Mae L. Tompong	t	national_anthem_and_emcee	\N	f	Custom text override.	2026-06-30 12:59:33.436	2026-06-30 13:03:18.853
cmr0nlmm600geiaoc7s89hhii	cmr0nlmm500g3iaociu1cnhk2	emcee	Emcee	100	OVERRIDDEN	cmpm7nh3s0036iausxm44cu9t	cmpmalk2l004qiausp3pm1z6f	Marivic R. Escobido, SG 14 - Registration Officer II	t	\N	national_anthem	f	Manual personnel replacement.	2026-06-30 12:59:33.436	2026-06-30 13:05:53.482
\.


--
-- Data for Name: ConvocationTemplateItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ConvocationTemplateItem" (id, "itemKey", "itemLabel", "itemOrder", "defaultMode", "fixedTextValue", "isEnabled", "rotationKey", "mirrorOfItemKey", "createdAt", "updatedAt") FROM stdin;
conv_item_prayer	prayer	Prayer	10	FIXED	AVP	t	\N	\N	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
conv_item_anthem	national_anthem	Singing of National Anthem	20	ASSIGNABLE	\N	t	national_anthem_and_emcee	\N	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
conv_item_bagong	bagong_pilipinas	Bagong Pilipinas Hymn	30	FIXED	AVP	t	\N	\N	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
conv_item_flag	flag_pledge	Panunumpa sa Watawat ng Pilipinas	40	ASSIGNABLE	\N	t	flag_pledge	\N	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
conv_item_lingkod	lingkod_bayan_pledge	Panunumpa ng Lingkod Bayan	50	ASSIGNABLE	\N	t	lingkod_bayan_pledge	\N	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
conv_item_psa	psa_vision_mission_values	PSA Vision, Mission, Core Values & Corporate Personality	60	ASSIGNABLE	\N	t	psa_vision_mission_values	\N	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
conv_item_quality	quality_policy	Quality Policy	70	ASSIGNABLE	\N	t	quality_policy	\N	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
conv_item_message	message	Message	80	FIXED	Maria Liza M. Bigornia	t	\N	\N	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
conv_item_emcee	emcee	Emcee	100	MIRRORED	\N	t	\N	national_anthem	2026-05-28 15:13:16.148	2026-05-28 15:13:16.148
conv_item_zumba	zumba	Zumba	90	FIXED	AVP	t	\N	\N	2026-05-28 15:13:16.148	2026-05-28 16:29:06.938
\.


--
-- Data for Name: CustomEmoji; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CustomEmoji" (id, name, "imageUrl", "createdById", "createdAt") FROM stdin;
\.


--
-- Data for Name: EmployeeSeat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmployeeSeat" (id, "mapId", "furnitureId", "personnelId", "seatCode", "xPercent", "yPercent", section, room, remarks, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MapFurniture; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MapFurniture" (id, "mapId", "furnitureCode", "furnitureName", type, "xPercent", "yPercent", "widthPercent", "heightPercent", rotation, section, room, label, remarks, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: NetworkConnection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NetworkConnection" (id, "mapId", "sourceDeviceId", "targetDeviceId", "connectionType", "sourcePort", "targetPort", "cableLabel", "isVerified", remarks, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: NetworkDevice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NetworkDevice" (id, "mapId", "furnitureId", "employeeSeatId", "personnelId", "deviceCode", "deviceName", type, status, hostname, "ipAddress", "macAddress", section, room, "xPercent", "yPercent", "lastSeenAt", remarks, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: NetworkMap; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NetworkMap" (id, name, description, "imageUrl", "isActive", "isLocked", "createdById", "createdAt", "updatedAt") FROM stdin;
cmqggnwqe00cdiaqoey9rverb	1	\N	/uploads/network-maps/map-cmqggnwqe00cdiaqoey9rverb-1781606482080.png	f	f	cmplkm5x70000iaeg6ej70tgq	2026-06-16 09:49:59.03	2026-06-16 10:41:22.189
\.


--
-- Data for Name: PasswordResetToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PasswordResetToken" (id, "userId", "tokenHash", "expiresAt", "usedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: PdfTemplate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PdfTemplate" (id, name, description, "fileName", "fileUrl", "pageCount", "fieldMap", "isActive", "createdById", "createdAt", "updatedAt", "templateFeature", "isDefault") FROM stdin;
cmpqk9iam000dia5sib2j3o3n	Convocation Program v2	\N	Convocation Program.pdf	/uploads/pdf-templates/1780037325008-Convocation_Program.pdf	2	{"fields": [{"x": 520.4399999999999, "y": 525, "id": "81d98436-fbc5-4a93-a995-345acb4dfdbe", "key": "programDate", "wrap": false, "label": "Program Date", "isBold": true, "fontSize": 31, "maxWidth": 222, "alignment": "center", "fontColor": "#0b3384", "fontFamily": "Trajan Pro", "pageNumber": 1, "shrinkToFit": true}, {"x": 238, "y": 104, "id": "be2dc2cf-5009-47d1-8368-bec718a2f92e", "key": "nationalAnthem", "wrap": false, "label": "National Anthem", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 179, "id": "b2d846ee-9150-4bd6-bd0e-9b10c7fec4d6", "key": "flagPledge", "wrap": false, "label": "Flag Pledge", "isBold": true, "fontSize": 12, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "maxHeight": 19, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 227, "id": "8ce31c54-8ba4-4b72-b218-41d7225c5590", "key": "lingkodBayanPledge", "wrap": false, "label": "Lingkod Bayan Pledge", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 285, "id": "0977e0fb-490f-430b-bbcf-51573b168d80", "key": "psaVisionMission", "wrap": false, "label": "Psa Vision Mission", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 339, "id": "4007b297-06d3-467d-9e19-58a62fe9c0a9", "key": "qualityPolicy", "wrap": false, "label": "Quality Policy", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 238, "y": 375, "id": "1c1ade6f-ff76-4aa6-8cf3-6671e21dbe0f", "key": "message", "wrap": false, "label": "Message", "isBold": true, "fontSize": 13, "maxWidth": 145, "alignment": "left", "fontColor": "#0B3384", "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}, {"x": 119, "y": 513, "id": "0a15e238-99e4-4ba6-b468-c3ea2dfebb96", "key": "emcee", "wrap": false, "label": "Emcee", "isBold": true, "fontSize": 13, "maxWidth": 180, "alignment": "center", "fontColor": "#0b3384", "maxHeight": 23, "fontFamily": "Helvetica", "pageNumber": 2, "shrinkToFit": true}], "version": 1, "pageSizes": [{"width": 841.92, "height": 595.2}, {"width": 841.92, "height": 595.2}]}	t	cmplkm5x70000iaeg6ej70tgq	2026-05-29 06:48:45.022	2026-06-30 13:16:35.499	CONVOCATION_PROGRAM	t
\.


--
-- Data for Name: Personnel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Personnel" (id, slug, "employeeNo", "fullName", "position", section, email, "contactNo", "isActive", "archiveReason", "archiveDate", "createdAt", "updatedAt", "locationStatus", "travelDestination", "travelDetails", "travelEndDate", "travelStartDate", "photoUrl") FROM stdin;
cmpma9o460043iausnsgkdz9b	glenda-c-bazar	PSA1043-019	Glenda C. Bazar	SG 6 - Administrative Aide VI	Administrative and Accounting	g.bazar@psa.gov.ph	\N	t	\N	\N	2026-05-26 06:57:51.703	2026-05-26 06:57:51.703	office	\N	\N	\N	\N	\N
cmpmakc8i004liaus6oylw747	kathleen-marie-p-medel	PSA1043-025	Kathleen Marie P. Medel	Data Encoder*	Statistical Operations	k.medel.psa@gmail.com	\N	t	\N	\N	2026-05-26 07:06:09.523	2026-06-02 10:07:38.104	on_travel	Tagoloan, Gingoog City, Opol, Lugait, Misamis Oriental	\N	2026-02-23 16:00:00	2026-02-22 16:00:00	/uploads/personnel/1780171196138-241.webp
cmpmcug27005hiauszp8pd7lt	sheila-p-degala	PSA1043-033	Sheila P. Degala	SG 9 - Assistant Statistician*	Statistical Operations	s.degala.psa@gmail.com	\N	t	\N	\N	2026-05-26 08:10:00.271	2026-06-02 10:07:41.742	on_travel	Bugo, Macabalan, Cagayan de Oro City, Tagoloan	\N	2026-06-04 16:00:00	2026-06-02 16:00:00	/uploads/personnel/1780171290632-190.webp
cmpmcyll0005tiaus9udmpd06	clarissa-l-nico	PSA1043-037	Clarissa L. Nico	SG 9 - Assistant Statistician	Statistical Operations	c.nico.psa@gmail.com	\N	t	\N	\N	2026-05-26 08:13:14.053	2026-06-02 10:07:41.08	on_travel	Medina, Kinoguitan, Jasaan, Alubijid, and Tagoloan, Misamis Oriental	\N	2026-05-30 16:00:00	2026-05-06 16:00:00	/uploads/personnel/1780171131749-358.webp
cmpmaaekm0046iausrahtxbtp	brian-jay-sacala	PSA1043-020	Brian Jay Sacala	SG 16 - Information System Analyst II**	Statistical Operations	b.sacala@psa.gov.ph	\N	t	\N	\N	2026-05-26 06:58:25.99	2026-06-02 10:07:41.834	on_travel	Salay, and Medina, Misamis Oriental	\N	2026-06-01 16:00:00	2026-05-31 16:00:00	\N
cmpm6ioph002niausbtnw8zo3	maria-liza-m-bigornia	PSA1043-001	Maria Liza M. Bigornia	SG 24 - Chief Statistical Specialist	Head of Office	l.bigornia@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:12:53.909	2026-06-02 10:07:41.777	on_travel	Casinglot, Tagoloan, Misamis Oriental	\N	2026-05-27 16:00:00	2026-05-27 16:00:00	/uploads/personnel/1780170539232-396.webp
cmpm6jzck002siausjij512h3	jerwin-a-asi-ero	PSA1043-002	Jerwin A. Asiñero	SG 19 - Senior Statistical Specialist	Statistical Operations	j.asinero@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:13:54.356	2026-06-02 10:07:41.263	on_travel	Opol, Misamis Oriental	\N	2026-05-13 16:00:00	2026-05-13 16:00:00	\N
cmpmczbk0005wiausmycr3jbp	catherine-mae-g-chin	PSA1043-038	Catherine Mae G. Chin	Field Office Personnel***	Civil Registration and Vital Statistics	\N	\N	t	\N	\N	2026-05-26 08:13:47.712	2026-05-30 19:52:49.13	office	\N	\N	\N	\N	/uploads/personnel/1780170769121-894.webp
cmpmain42004fiaus2twkusb1	cherry-may-c-parajis	PSA1043-023	Cherry May C. Parajis	Field Office Personnel***	Civil Registration and Vital Statistics	\N	\N	t	\N	\N	2026-05-26 07:04:50.306	2026-05-30 19:54:13.635	office	\N	\N	\N	\N	/uploads/personnel/1780170853627-344.webp
cmpmackhz004ciausks7jgn0o	kimberly-f-esmeralda	PSA1043-022	Kimberly F. Esmeralda	Field Office Personnel***	Civil Registration and Vital Statistics	\N	\N	t	\N	\N	2026-05-26 07:00:06.983	2026-05-30 19:55:52.981	office	\N	\N	\N	\N	/uploads/personnel/1780170952969-5.webp
cmpmaayyh0049iausqyybqoai	claudevan-a-macabale	PSA1043-021	Claudevan A. Macabale	SG 12 - Information System Analyst I**	Philippine Identification System	c.macabale.psa@gmail.com	09696018203	t	\N	\N	2026-05-26 06:58:52.409	2026-06-02 10:07:40.577	on_travel	El Salvador City, Misamis Oriental	\N	2026-05-11 16:00:00	2026-05-10 16:00:00	/uploads/personnel/1780243744525-646.webp
cmpm7sv69003oiausjksd398m	merlie-t-montera	PSA1043-014	Merlie T. Montera	SG 9 - Assistant Statistician	Statistical Operations	m.montera@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:48:48.466	2026-06-02 10:07:40.517	on_travel	Selected Cities and Municipalities of Misamis Oriental	\N	2026-07-30 16:00:00	2026-04-26 16:00:00	/uploads/personnel/1780171376490-229.webp
cmpmamcwq004viaus5y4atq5q	hector-b-paylangco	PSA1043-027	Hector B. Paylangco	Driver*	Administrative and Accounting	\N	\N	t	\N	\N	2026-05-26 07:07:43.706	2026-06-02 10:07:41.873	on_travel	Different Cities and Municipalities of Misamis Oriental	\N	2026-06-03 16:00:00	2026-05-31 16:00:00	\N
cmpm7s7j8003liauswjjxk8ex	marlon-t-galindo	PSA1043-013	Marlon T. Galindo	SG 9 - Assistant Statistician	Statistical Operations	m.galindo@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:48:17.829	2026-06-02 10:07:41.173	on_travel	Magsaysay, Misamis Oriental	\N	2026-05-17 16:00:00	2026-05-17 16:00:00	\N
cmpmbbun40051iaus0ypzmgo0	christian-jen-d-labado	PSA1043-029	Christian Jen D. Labado	SG 14 - Registration Officer II*	Philippine Identification System	c.labado.psa@gmail.com	\N	t	\N	\N	2026-05-26 07:27:33.088	2026-06-02 10:07:41.982	on_travel	Puntod, Cagayan de Oro City	\N	2026-05-29 16:00:00	2026-05-29 16:00:00	\N
cmpm7q17h003fiausimucssfj	milan-l-gutay	PSA1043-010	Milan L. Gutay	SG 16 - Statistical Specialist II	Statistical Operations	m.gutay@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:46:36.318	2026-06-02 10:07:41.863	on_travel	Different Cities and Municipalities of Misamis Oriental	\N	2026-06-03 16:00:00	2026-05-31 16:00:00	/uploads/personnel/1780171461852-837.webp
cmpm7nzmm0039iauss19l621g	jemima-p-gutoc	PSA1043-007	Jemima P. Gutoc	SG 12 - Accountant I	Administrative and Accounting	j.gutoc@psa.gov.pph	\N	t	\N	\N	2026-05-26 05:45:00.958	2026-06-02 10:07:39.582	on_travel	Selected Cities and Municipalities of Misamis Oriental	\N	2026-03-30 16:00:00	2026-03-22 16:00:00	/uploads/personnel/1780170634336-856.webp
cmpmanuku004yiaush28acnzm	christian-bryan-a-abaragan	PSA1043-028	Christian Bryan A. Abaragan	Utility*	N/A	\N	\N	t	\N	\N	2026-05-26 07:08:53.262	2026-05-31 02:10:50.97	office	\N	\N	\N	\N	\N
cmpmcxxg5005qiausn9g2slk7	edwin-d-me-oza	PSA1043-036	Edwin D. Meñoza	SG 16 - Statistical Specialist II*	Statistical Operations	e.menoza.psa@gmail.com	\N	t	\N	\N	2026-05-26 08:12:42.774	2026-06-02 10:07:41.839	on_travel	Salay, and Medina, Misamis Oriental	\N	2026-06-01 16:00:00	2026-05-31 16:00:00	\N
cmpmalk2l004qiausp3pm1z6f	joselindo-c-udal	PSA1043-026	Joselindo C. Udal	Driver*	Philippine Identification System	\N	\N	t	\N	\N	2026-05-26 07:07:06.334	2026-06-02 10:07:41.993	on_travel	Puntod, Cagayan de Oro City	\N	2026-05-29 16:00:00	2026-05-29 16:00:00	\N
cmpmcv3uk005kiausndde2tr6	ronel-l-llamera	PSA1043-034	Ronel L. Llamera	SG 12 - Information System Analyst I*	Statistical Operations	r.llamera.psa@gmail.com	\N	t	\N	\N	2026-05-26 08:10:31.101	2026-06-02 10:07:41.268	on_travel	Opol, Misamis Oriental	\N	2026-05-13 16:00:00	2026-05-13 16:00:00	\N
cmpm4p7n6001qiausf4s5ahht	grad-lucky-mark-n-arcega	PSA1043-011	Grad Lucky Mark N. Arcega	SG 11 - Statistical Analyst	Statistical Operations	g.arcega@psa.gov.ph	\N	t	\N	\N	2026-05-26 04:21:59.155	2026-06-02 10:07:42.014	on_travel	Selected Cities and Municipalities of Misamis Oriental	\N	2026-07-10 16:00:00	2026-06-16 16:00:00	\N
cmpmajetn004iiaus2vel52gz	wed-micole-b-quilang	PSA1043-024	Wed Micole B. Quilang	Birth Registration Assistant*	Civil Registration and Vital Statistics	w.quilang.psa@gmail.com	\N	t	\N	\N	2026-05-26 07:05:26.219	2026-06-02 10:07:41.797	on_travel	Casinglot, Tagoloan, Misamis Oriental	\N	2026-05-27 16:00:00	2026-05-27 16:00:00	\N
cmpmcwkjj005niausxhpwr0rq	paula-p-dedumo	PSA1043-035	Paula P. Dedumo	SG 11 - Statistical Analyst*	Statistical Operations	p.dedumo.psa@gmail.com	\N	t	\N	\N	2026-05-26 08:11:39.392	2026-06-02 10:07:41.869	on_travel	Different Cities and Municipalities of Misamis Oriental	\N	2026-06-03 16:00:00	2026-05-31 16:00:00	/uploads/personnel/1780171670208-599.webp
cmpm7p9r4003ciausxxtm77m0	jose-edgar-d-estrella	PSA1043-009	Jose Edgar D. Estrella	SG 11 - Administrative Officer II	Administrative and Accounting	j.estrella@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:46:00.736	2026-06-02 10:07:41.441	on_travel	Balingasag, Sugbongcogon, Kinoguitan, and Balingoan, Misamis Oriental	\N	2026-05-18 16:00:00	2026-05-18 16:00:00	\N
cmpmd0y8g005ziausnc38ns1g	sheila-may-d-regular	PSA1043-039	Sheila May D. Regular	SG 11 - Statistical Analyst*	Statistical Operations	s.regular.psa@gmail.com	\N	t	\N	\N	2026-05-26 08:15:03.76	2026-05-30 20:04:48.202	office	\N	\N	\N	\N	/uploads/personnel/1780171488194-716.webp
cmpm7wjyu003riaus32ihl37b	cindy-b-dumaloan	PSA1043-015	Cindy B. Dumaloan	SG 10 - Registration Officer I	Civil Registration and Vital Statistics	c.dumaloan@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:51:40.567	2026-06-02 10:07:37.846	on_travel	City Jail, Lumbia, Cagayan de Oro City, Misamis Oriental	\N	2026-02-12 16:00:00	2026-02-12 16:00:00	/uploads/personnel/1780170888926-603.webp
cmpmcsydy005biaus8mz8wrn4	rodelyn-e-navarosa	PSA1043-031	Rodelyn E. Navarosa	Data Encoder*	Statistical Operations	r.navarosa.psa@gmail.com	\N	t	\N	\N	2026-05-26 08:08:50.71	2026-06-02 10:07:41.686	on_travel	within Cagayan de Oro City	\N	2026-06-16 16:00:00	2026-05-31 16:00:00	/uploads/personnel/1780171415751-31.webp
cmpm7z8kc003xiauswx84u6ek	maria-guada-f-dosdos	PSA1043-017	Maria Guada F. Dosdos	SG 9 - Administrative Assistant III	Administrative and Accounting	m.flores@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:53:45.756	2026-06-02 10:07:40.459	on_travel	Laguindingan Airport, Laguindingan, Misamis Oriental and Cagayan de Oro City	\N	2026-04-23 16:00:00	2026-04-21 16:00:00	/uploads/personnel/1780170683689-900.webp
cmpm7rduc003iiausmprulwf1	aaron-allen-e-cainglet	PSA1043-012	Aaron Allen E. Cainglet	SG 11 - Statistical Analyst	Statistical Operations	a.cainglet@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:47:39.348	2026-06-02 10:07:41.738	on_travel	Bugo, Macabalan, Cagayan de Oro City, Tagoloan	\N	2026-06-04 16:00:00	2026-06-02 16:00:00	\N
cmpm7nh3s0036iausxm44cu9t	marivic-r-escobido	PSA1043-006	Marivic R. Escobido	SG 14 - Registration Officer II	Civil Registration and Vital Statistics	m.escobido@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:44:36.953	2026-06-02 10:07:41.783	on_travel	Casinglot, Tagoloan, Misamis Oriental	\N	2026-05-27 16:00:00	2026-05-27 16:00:00	/uploads/personnel/1780170989546-356.webp
cmpm70pwb002yiaus2m2fx6w0	lee-charge-s-cailing	PSA1043-004	Lee Charge S. Cailing	SG 16 - Statistical Specialist II	Statistical Operations	l.cailing@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:26:55.259	2026-06-02 10:07:41.961	on_travel	Cagayan de Oro City to Magsaysay, Misamis Oriental	\N	2026-06-14 16:00:00	2026-05-31 16:00:00	/uploads/personnel/1780171246216-89.webp
cmpm9wtav0040iaus5stdmg52	vevien-p-baculio	PSA1043-018	Vevien P. Baculio	SG 6 - Administrative Aide VI	Administrative and Accounting	v.baculio@psa.gov.ph	\N	t	\N	\N	2026-05-26 06:47:51.895	2026-06-02 10:07:41.487	on_travel	National ID Fixed Registration Center, Cagayan de Oro City	\N	2026-05-21 16:00:00	2026-05-14 16:00:00	/uploads/personnel/1780170727753-365.webp
cmpm71afq0031iausuxhheoyf	deana-dell-b-pornia	PSA1043-005	Deana Dell B. Pornia	SG 16 - Statistical Specialist II	Statistical Operations	d.pornia@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:27:21.878	2026-06-02 10:07:40.982	on_travel	Tagoloan, Villanueva, Jasaan, Balingasag, Balingoan, Talisayan, and Gingoog City,  Misamis Oriental	\N	2026-05-07 16:00:00	2026-05-06 16:00:00	/uploads/personnel/1780171165582-536.webp
cmpm6z80v002viausbcqx3ozw	adams-christopher-p-sios-e	PSA1043-003	Adams Christopher P. Sios-e	SG 16 - Statistical Specialist II	Statistical Operations	a.siose@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:25:45.439	2026-06-02 10:07:41.069	on_travel	Medina, Kinoguitan, Jasaan, Alubijid, and Tagoloan, Misamis Oriental	\N	2026-05-30 16:00:00	2026-05-06 16:00:00	\N
cmpmctto9005eiaus7jv5w8sw	queenie-marie-b-casi-o	PSA1043-032	Queenie Marie B. Casiño	SG 11 - Statistical Analyst*	Statistical Operations	q.casino.psa@gmail.com	\N	t	\N	\N	2026-05-26 08:09:31.258	2026-06-02 10:07:40.397	on_travel	Different Cities and Municipalities of Misamis Oriental	\N	2026-05-06 16:00:00	2026-04-27 16:00:00	/uploads/personnel/1780171564908-106.webp
cmpm7y2d5003uiaushuvnjj0w	may-t-dublin	PSA1043-016	May T. Dublin	SG 10 - Registration Officer I	Civil Registration and Vital Statistics	m.dublin@psa.gov.ph	\N	t	\N	\N	2026-05-26 05:52:51.066	2026-06-02 10:07:41.563	on_travel	Villanueva, Misamis Oriental	\N	2026-05-27 16:00:00	2026-05-27 16:00:00	/uploads/personnel/1780171032577-127.webp
cmpmcmiud0058iaustuwfw2sp	angel-marie-c-guillena	PSA1043-030	Angel Marie C. Guillena	Data Encoder*	Administrative and Accounting	a.guillena.psa@gmail.com	\N	t	\N	\N	2026-05-26 08:03:50.629	2026-06-02 10:07:41.681	on_travel	within Cagayan de Oro City	\N	2026-06-16 16:00:00	2026-05-31 16:00:00	/uploads/personnel/1780170581446-215.webp
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, name, slug, code, description, category, subcategory, section, year, frequency, "customFrequency", priority, "workloadWeight", "estimatedMandays", status, "uiLayout", "showDescription", "showOperationWorkload", "showDeadlineSubmission", "showDateSubmitted", "showTotalSamplesDocuments", "showResponseRate", "operationWorkloadLabel", "deadlineSubmissionLabel", "dateSubmittedLabel", "totalSamplesDocumentsLabel", "responseRateLabel", "customTaskColumns", "canvasLayout", "isActive", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
cmplkm5z4000qiaeghfsiokth	Consumer Price Index	consumer-price-index	CPI	Consumer Price Index monitoring record for Phase 1 dashboard validation.	STATISTICAL_OPERATIONS	Statistical Framework and Indicators System	Price Statistics	2026	MONTHLY	\N	HIGH	1.2	23	OVERDUE	BALANCED	t	t	t	t	t	t	Project/Operation/Workload	Deadline of Submission	Date Submitted	Total Sample/Documents	Response Rate	\N	\N	t	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-05-25 18:59:44.704	2026-05-25 18:59:44.704
cmplkm603001iiaeg6l8oh3we	Annual Survey of Philippine Business and Industry	annual-survey-of-philippine-business-and-industry	ASPBI	Annual Survey of Philippine Business and Industry monitoring record for Phase 1 dashboard validation.	STATISTICAL_OPERATIONS	Establishment Surveys	Business and Industry	2026	ANNUAL	\N	HIGH	1.6	29	DUE_TODAY	BALANCED	t	t	t	t	t	t	Project/Operation/Workload	Deadline of Submission	Date Submitted	Total Sample/Documents	Response Rate	\N	\N	t	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-05-25 18:59:44.74	2026-05-25 18:59:44.74
cmplkm60i001wiaegyl0v07fo	Mapping Activities	mapping-activities	MAP	Mapping Activities monitoring record for Phase 1 dashboard validation.	STATISTICAL_OPERATIONS	Census, Sampling Frames, and Community-Based Monitoring System	Mapping and Geospatial	2026	AD_HOC	\N	MEDIUM	1.8	32	ON_TRACK	BALANCED	t	t	t	t	t	t	Project/Operation/Workload	Deadline of Submission	Date Submitted	Total Sample/Documents	Response Rate	\N	\N	t	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-05-25 18:59:44.754	2026-05-25 18:59:44.754
cmplkm60v002aiaegc40p2nl8	Foreign Trade Statistics	foreign-trade-statistics	FTS	Foreign Trade Statistics monitoring record for Phase 1 dashboard validation.	STATISTICAL_OPERATIONS	Administrative Data	Trade Statistics	2026	MONTHLY	\N	MEDIUM	2	35	NO_DEADLINE	BALANCED	t	t	t	t	t	t	Project/Operation/Workload	Deadline of Submission	Date Submitted	Total Sample/Documents	Response Rate	\N	\N	t	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-05-25 18:59:44.767	2026-05-25 18:59:44.767
cmplkm61a002oiaegialj9xsh	Building Permits	building-permits	BP	Building Permits monitoring record for Phase 1 dashboard validation.	STATISTICAL_OPERATIONS	Administrative Data	Construction Statistics	2026	MONTHLY	\N	MEDIUM	2.2	38	DUE_SOON	BALANCED	t	t	t	t	t	t	Project/Operation/Workload	Deadline of Submission	Date Submitted	Total Sample/Documents	Response Rate	\N	\N	t	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-05-25 18:59:44.782	2026-05-25 18:59:44.782
cmplkm5y6000ciaegi2o56pke	Labor Force Survey	labor-force-survey	LFS	Labor Force Survey monitoring record for Phase 1 dashboard validation.	STATISTICAL_OPERATIONS	Household Surveys	Labor Statistics	2026	MONTHLY	\N	HIGH	1	20	COMPLETED	BALANCED	t	t	t	t	t	t	Project/Operation/Workload	Deadline of Submission	Date Submitted	Total Samples	Response Rate	\N	\N	t	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-05-25 18:59:44.67	2026-05-26 17:20:53.544
cmq7y09cq00hpiahcqaix09q0	National Migration Survey	national-migration-survey-tw9c	NMS	A survey that provides information on the mobility of the Philippine population to help policymakers and program managers design services for people moving within the country or going abroad.	STATISTICAL_OPERATIONS	\N	\N	2025	CUSTOM	Periodic	MEDIUM	1	0	NO_DEADLINE	BALANCED	t	t	t	t	t	t	Project/Operation/Workload	Deadline of Submission	Date Submitted	Total Samples	Response Rate	\N	\N	t	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-06-10 10:45:33.146	2026-06-10 11:16:16.459
cmplkm5zm0014iaegcniw9u39	Family Income and Expenditure Survey	family-income-and-expenditure-survey	FIES	Family Income and Expenditure Survey monitoring record for Phase 1 dashboard validation.	STATISTICAL_OPERATIONS	Household Surveys	Income and Expenditure	2025	CUSTOM	Triennial | 2 Visits	CRITICAL	1.4	26	DUE_SOON	BALANCED	t	t	t	t	t	t	Project/Operation/Workload	Deadline of Submission	Date Submitted	Total Samples	Response Rate	\N	\N	t	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-05-25 18:59:44.722	2026-06-10 14:57:47.784
cmqhv7wb001pviawo89gn74fs	Frame Unit’s National Grid-based Address System	frame-unit-s-national-grid-based-address-system-tbfs	FUNGAS	2025 FUNGAS V2	STATISTICAL_OPERATIONS	\N	\N	2025	CUSTOM	Per Operation / Special Cycle	MEDIUM	1	0	NO_DEADLINE	BALANCED	t	t	t	t	t	t	Project/Operation/Workload	Deadline of Submission	Date Submitted	Total Samples	Response Rate	[]	\N	t	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-06-17 09:25:12.395	2026-06-17 09:43:04.185
cmq87cpd100c9iab8rqhkko1x	Commodity Flow Survey	commodity-flow-survey-27pr	CFS	\N	STATISTICAL_OPERATIONS	\N	\N	2026	QUARTERLY	\N	MEDIUM	1	0	NO_DEADLINE	BALANCED	t	t	t	t	t	t	Project/Operation/Workload	Deadline of Submission	Date Submitted	Total Samples	Response Rate	\N	\N	t	cmplkm5x70000iaeg6ej70tgq	cmplkm5x70000iaeg6ej70tgq	2026-06-10 15:07:10.309	2026-06-11 00:44:46.409
\.


--
-- Data for Name: ProjectCycle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectCycle" (id, "projectId", "cycleName", month, quarter, year, "startDate", deadline, "dateSubmitted", progress, "responseRate", "totalSamplesDocuments", status, remarks, "isActive", "createdAt", "updatedAt") FROM stdin;
cmplkm5zc000wiaegf5mbm067	cmplkm5z4000qiaeghfsiokth	Initial Monitoring Cycle	5	\N	2026	2026-05-06 01:00:00	2026-05-23 01:00:00	\N	48	50	125	OVERDUE	Seeded Phase 1 monitoring cycle.	t	2026-05-25 18:59:44.712	2026-05-25 18:59:44.712
cmplkm609001oiaegwrepnr5t	cmplkm603001iiaeg6l8oh3we	Initial Monitoring Cycle	\N	\N	2026	2026-05-06 01:00:00	2026-05-26 01:00:00	\N	43	60	175	DUE_TODAY	Seeded Phase 1 monitoring cycle.	t	2026-05-25 18:59:44.746	2026-05-25 18:59:44.746
cmplkm60n0022iaegkh622c6k	cmplkm60i001wiaegyl0v07fo	Initial Monitoring Cycle	\N	\N	2026	2026-05-06 01:00:00	2026-06-07 01:00:00	\N	30	65	200	ON_TRACK	Seeded Phase 1 monitoring cycle.	t	2026-05-25 18:59:44.76	2026-05-25 18:59:44.76
cmplkm610002giaeghtym67y0	cmplkm60v002aiaegc40p2nl8	Initial Monitoring Cycle	5	\N	2026	2026-05-06 01:00:00	\N	\N	20	70	225	NO_DEADLINE	Seeded Phase 1 monitoring cycle.	t	2026-05-25 18:59:44.773	2026-05-25 18:59:44.773
cmplkm61f002uiaegykaylaoj	cmplkm61a002oiaegialj9xsh	Initial Monitoring Cycle	5	\N	2026	2026-05-06 01:00:00	2026-05-18 01:00:00	\N	75	75	250	DUE_SOON	Seeded Phase 1 monitoring cycle.	t	2026-05-25 18:59:44.787	2026-05-25 18:59:44.787
cmplkm5zs001aiaegn3s1ybqj	cmplkm5zm0014iaegcniw9u39	2025 FIES Visit 2	\N	\N	2026	2026-05-06 01:00:00	2026-05-30 01:00:00	\N	40	55	150	DUE_SOON	Seeded Phase 1 monitoring cycle.	t	2026-05-25 18:59:44.729	2026-06-10 14:57:47.797
cmpm2d1lt0007iaus9wv88xnj	cmplkm5y6000ciaegi2o56pke	January 2026	1	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.225	2026-05-26 17:20:53.556
cmpm2d1mb000fiausxcic21q8	cmplkm5y6000ciaegi2o56pke	February 2026	2	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.244	2026-05-26 17:20:53.57
cmpm2d1mf000hiausxnjzupt7	cmplkm5y6000ciaegi2o56pke	March 2026	3	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.247	2026-05-26 17:20:53.586
cmpm2d1ml000jiaus0i2ojuzx	cmplkm5y6000ciaegi2o56pke	April 2026	4	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.253	2026-05-26 17:20:53.596
cmpm2d1mo000liausqeogy9jz	cmplkm5y6000ciaegi2o56pke	May 2026	5	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.257	2026-05-26 17:20:53.607
cmq87oi0j00i7iab8uncvoz88	cmq87cpd100c9iab8rqhkko1x	4th Quarter of 2025	\N	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-06-10 15:16:20.659	2026-06-11 00:44:46.427
cmq8rzi7k00dpiadwldvrzqw4	cmq87cpd100c9iab8rqhkko1x	1st Quarter of 2026	\N	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-06-11 00:44:46.448	2026-06-11 00:44:46.448
cmqhvbtpv01sviawo4jnykejy	cmqhv7wb001pviawo89gn74fs	February 2025	\N	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-06-17 09:28:15.667	2026-06-17 09:43:04.194
cmpm2d1ms000niauspkq83zed	cmplkm5y6000ciaegi2o56pke	June 2026	6	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.261	2026-05-26 17:20:53.618
cmpm2d1mw000piausoirmd6vi	cmplkm5y6000ciaegi2o56pke	July 2026	7	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.264	2026-05-26 17:20:53.634
cmpm2d1mz000riaus3fuzjx6n	cmplkm5y6000ciaegi2o56pke	August 2026	8	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.267	2026-05-26 17:20:53.645
cmpm2d1n2000tiausj6ewv4x5	cmplkm5y6000ciaegi2o56pke	September 2026	9	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.27	2026-05-26 17:20:53.657
cmpm2d1n5000viaus0p9ty0zc	cmplkm5y6000ciaegi2o56pke	October 2026	10	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.273	2026-05-26 17:20:53.668
cmpm2d1n8000xiaus88hlh1rc	cmplkm5y6000ciaegi2o56pke	November 2026	11	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.276	2026-05-26 17:20:53.678
cmpm2d1nb000ziaus7vraaotz	cmplkm5y6000ciaegi2o56pke	December 2026	12	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-05-26 03:16:32.279	2026-05-26 17:20:53.689
cmq7z3ro40144iahcn8b8k58g	cmq7y09cq00hpiahcqaix09q0	Operation	\N	\N	2026	\N	\N	\N	0	\N	\N	ON_TRACK	\N	t	2026-06-10 11:16:16.468	2026-06-10 11:16:16.468
\.


--
-- Data for Name: ProjectPermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectPermission" (id, "projectId", "userId", "canView", "canEdit", "canSubmit", "canApprove", "canManage", "assignedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ProjectPersonnel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectPersonnel" (id, "projectId", "personnelId", "roleInProject", "isFocalPerson", "createdAt", "updatedAt") FROM stdin;
cmpmwiw4w00aiiaushkq6vevc	cmplkm5y6000ciaegi2o56pke	cmpm6z80v002viausbcqx3ozw	Focal Person	t	2026-05-26 17:20:53.552	2026-05-26 17:20:53.552
cmq870nbm005liab86zdt3p4n	cmplkm5zm0014iaegcniw9u39	cmpm6z80v002viausbcqx3ozw	Focal Person	t	2026-06-10 14:57:47.794	2026-06-10 14:57:47.794
cmq8rzi6s00dniadwlf7uon3m	cmq87cpd100c9iab8rqhkko1x	cmpm7q17h003fiausimucssfj	Focal Person	t	2026-06-11 00:44:46.421	2026-06-11 00:44:46.421
cmqhvuvb3022aiawoc931wp2m	cmqhv7wb001pviawo89gn74fs	cmpm4p7n6001qiausf4s5ahht	Focal Person	t	2026-06-17 09:43:04.191	2026-06-17 09:43:04.191
\.


--
-- Data for Name: ProjectRemark; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectRemark" (id, "projectId", "projectCycleId", "taskId", "authorId", "remarkText", "createdAt", "updatedAt") FROM stdin;
cmplkm5yz000oiaegro8bhmvo	cmplkm5y6000ciaegi2o56pke	\N	\N	cmplkm5x70000iaeg6ej70tgq	Seeded initial monitoring remark for dashboard validation.	2026-05-25 18:59:44.699	2026-05-25 18:59:44.699
cmplkm5zk0012iaeg9u5jdzyk	cmplkm5z4000qiaeghfsiokth	\N	\N	cmplkm5x70000iaeg6ej70tgq	Seeded initial monitoring remark for dashboard validation.	2026-05-25 18:59:44.72	2026-05-25 18:59:44.72
cmplkm601001giaegjkp0pw9q	cmplkm5zm0014iaegcniw9u39	\N	\N	cmplkm5x70000iaeg6ej70tgq	Seeded initial monitoring remark for dashboard validation.	2026-05-25 18:59:44.737	2026-05-25 18:59:44.737
cmplkm60g001uiaegsatqknmb	cmplkm603001iiaeg6l8oh3we	\N	\N	cmplkm5x70000iaeg6ej70tgq	Seeded initial monitoring remark for dashboard validation.	2026-05-25 18:59:44.752	2026-05-25 18:59:44.752
cmplkm60t0028iaegil6oyuy8	cmplkm60i001wiaegyl0v07fo	\N	\N	cmplkm5x70000iaeg6ej70tgq	Seeded initial monitoring remark for dashboard validation.	2026-05-25 18:59:44.766	2026-05-25 18:59:44.766
cmplkm618002miaegp9r1bgfz	cmplkm60v002aiaegc40p2nl8	\N	\N	cmplkm5x70000iaeg6ej70tgq	Seeded initial monitoring remark for dashboard validation.	2026-05-25 18:59:44.781	2026-05-25 18:59:44.781
cmplkm61l0030iaegakp9cl9j	cmplkm61a002oiaegialj9xsh	\N	\N	cmplkm5x70000iaeg6ej70tgq	Seeded initial monitoring remark for dashboard validation.	2026-05-25 18:59:44.793	2026-05-25 18:59:44.793
\.


--
-- Data for Name: ProjectTask; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProjectTask" (id, "projectCycleId", "taskName", "assignedPersonnelId", "startDate", deadline, "dateSubmitted", progress, status, "responseRate", "totalSamplesDocuments", "customValues", "manualStatusOverride", remarks, "isSubtitle", "order", "isActive", "createdAt", "updatedAt") FROM stdin;
cmpm2d1m4000biauspq18niww	cmpm2d1lt0007iaus9wv88xnj	Machine Processing	\N	\N	2026-02-12 00:00:00	2026-02-11 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 03:16:32.236	2026-05-26 17:20:53.564
cmpm2d1m8000diauss7hqtr2j	cmpm2d1lt0007iaus9wv88xnj	Narrative Report	\N	\N	2026-02-20 00:00:00	2026-02-16 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 03:16:32.24	2026-05-26 17:20:53.567
cmpmftxw00091iauskdyt78pj	cmpm2d1mz000riaus3fuzjx6n	Enumeration	\N	\N	2026-08-31 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	0	t	2026-05-26 09:33:35.568	2026-05-26 17:20:53.648
cmplkm5zh0010iaegqvr7itl2	cmplkm5zc000wiaegf5mbm067	Validate monitoring file	\N	2026-05-13 01:00:00	2026-06-10 01:00:00	\N	35	ON_TRACK	52	65	\N	\N	Validation in progress.	f	0	t	2026-05-25 18:59:44.717	2026-05-25 18:59:44.717
cmplkm60r0026iaegkutdfa2a	cmplkm60n0022iaegkh622c6k	Conduct preliminary review	\N	2026-05-13 01:00:00	2026-06-16 01:00:00	\N	20	ON_TRACK	64	95	\N	\N	On schedule.	f	0	t	2026-05-25 18:59:44.763	2026-05-25 18:59:44.763
cmplkm60b001qiaegzbj8r0dj	cmplkm609001oiaegwrepnr5t	Review submitted documents	\N	2026-05-11 01:00:00	2026-05-26 01:00:00	\N	70	DUE_TODAY	52	80	\N	\N	For same-day review.	f	0	t	2026-05-25 18:59:44.748	2026-05-25 18:59:44.748
cmpmftxw40093iaus7qvhf6ip	cmpm2d1mz000riaus3fuzjx6n	Machine Processing	\N	\N	2026-09-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 09:33:35.572	2026-05-26 17:20:53.651
cmpmftxw70095iauseodyx62v	cmpm2d1mz000riaus3fuzjx6n	Narrative Report	\N	\N	2026-09-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 09:33:35.575	2026-05-26 17:20:53.654
cmplkm613002iiaegngp9h1zf	cmplkm610002giaeghtym67y0	Document pending clarifications	\N	2026-05-11 01:00:00	\N	\N	10	NO_DEADLINE	\N	100	\N	\N	Awaiting official guidance.	f	0	t	2026-05-25 18:59:44.775	2026-05-25 18:59:44.775
cmplkm615002kiaegeey43bo2	cmplkm610002giaeghtym67y0	Draft process notes	\N	2026-05-13 01:00:00	\N	\N	30	NO_DEADLINE	\N	105	\N	\N	For internal review.	f	0	t	2026-05-25 18:59:44.778	2026-05-25 18:59:44.778
cmplkm61g002wiaegs2dtkvsc	cmplkm61f002uiaegykaylaoj	Complete first-pass validation	\N	2026-05-11 01:00:00	2026-05-18 01:00:00	2026-05-19 01:00:00	100	COMPLETED	64	110	\N	\N	Validation completed.	f	0	t	2026-05-25 18:59:44.789	2026-05-25 18:59:44.789
cmplkm5ze000yiaegbu6jdxks	cmplkm5zc000wiaegf5mbm067	Collect field updates	\N	2026-05-11 01:00:00	2026-05-23 01:00:00	\N	60	OVERDUE	44	60	\N	\N	Pending final section update.	f	0	t	2026-05-25 18:59:44.714	2026-05-25 18:59:44.714
cmplkm60d001siaegrmqlwsip	cmplkm609001oiaegwrepnr5t	Resolve unmatched records	\N	2026-05-13 01:00:00	\N	\N	15	NO_DEADLINE	\N	85	\N	\N	No deadline set yet.	f	0	t	2026-05-25 18:59:44.749	2026-05-25 18:59:44.749
cmplkm60p0024iaega1u82va0	cmplkm60n0022iaegkh622c6k	Prepare collection materials	\N	2026-05-11 01:00:00	2026-06-07 01:00:00	\N	40	ON_TRACK	56	90	\N	\N	Materials under preparation.	f	0	t	2026-05-25 18:59:44.762	2026-05-25 18:59:44.762
cmplkm61i002yiaegp3x9t1id	cmplkm61f002uiaegykaylaoj	Prepare supervisor briefing	\N	2026-05-13 01:00:00	2026-06-01 01:00:00	\N	50	DUE_SOON	72	115	\N	\N	Briefing deck in progress.	f	0	t	2026-05-25 18:59:44.79	2026-05-25 18:59:44.79
cmpmftxwd0097iaus86im5jkf	cmpm2d1n2000tiausj6ewv4x5	Enumeration	\N	\N	2026-09-30 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	0	t	2026-05-26 09:33:35.581	2026-05-26 17:20:53.66
cmpmftxwf0099iausenecfkxd	cmpm2d1n2000tiausj6ewv4x5	Machine Processing	\N	\N	2026-10-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 09:33:35.584	2026-05-26 17:20:53.663
cmpmftxwi009biausymtjqou9	cmpm2d1n2000tiausj6ewv4x5	Narrative Report	\N	\N	2026-10-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 09:33:35.587	2026-05-26 17:20:53.665
cmpmftxwo009diaus7feefng2	cmpm2d1n5000viaus0p9ty0zc	Enumeration	\N	\N	2026-10-31 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	0	t	2026-05-26 09:33:35.592	2026-05-26 17:20:53.67
cmpmftxwq009fiausr2jw84ej	cmpm2d1n5000viaus0p9ty0zc	Machine Processing	\N	\N	2026-12-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 09:33:35.595	2026-05-26 17:20:53.672
cmplkm5zv001ciaegimh3fee6	cmplkm5zs001aiaegn3s1ybqj	Enumeration	\N	2026-05-11 01:00:00	2026-02-05 00:00:00	2026-02-03 00:00:00	55	DUE_SOON	98.9	3242	{}	\N	\N	f	1	t	2026-05-25 18:59:44.731	2026-06-10 14:57:47.807
cmpm2d1ly0009iaus6p49zeib	cmpm2d1lt0007iaus9wv88xnj	Enumeration	\N	\N	2026-02-05 00:00:00	2026-02-03 00:00:00	0	ON_TRACK	98.9	\N	{}	\N	Orig deadline is Feb 16; FOG provides 15 days after data collection. However, due to 2026 GAA late approval by PBBM affecting the training to start on Feb. 5, making the enumeration date also moved to February 5. Hence, bing that NR is deadline after 15 days, the new date now for submission is on Feb. 20, 2026.	f	0	t	2026-05-26 03:16:32.231	2026-05-26 17:20:53.56
cmplkm5zy001eiaegxl1cg2u6	cmplkm5zs001aiaegn3s1ybqj	Machine Processing	\N	2026-05-13 01:00:00	2026-04-20 00:00:00	\N	25	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-25 18:59:44.734	2026-06-10 14:57:47.81
cmpmftxtu0081iauscsvw8hnm	cmpm2d1mb000fiausxcic21q8	Enumeration	\N	\N	2026-02-28 00:00:00	2026-02-26 00:00:00	0	ON_TRACK	100	201	{}	\N	\N	f	0	t	2026-05-26 09:33:35.49	2026-05-26 17:20:53.577
cmpmftxty0083iaussmv18wpz	cmpm2d1mb000fiausxcic21q8	Machine Processing	\N	\N	2026-03-15 00:00:00	2026-03-08 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 09:33:35.495	2026-05-26 17:20:53.58
cmpmftxu10085iausw1c6tr5z	cmpm2d1mb000fiausxcic21q8	Narrative Report	\N	\N	2026-03-15 00:00:00	2026-03-08 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 09:33:35.498	2026-05-26 17:20:53.583
cmpmftxu70087iaustbvqjg6e	cmpm2d1mf000hiausxnjzupt7	Enumeration	\N	\N	2026-03-31 00:00:00	2026-03-27 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	0	t	2026-05-26 09:33:35.504	2026-05-26 17:20:53.588
cmpmftxua0089iauspb3qxpj7	cmpm2d1mf000hiausxnjzupt7	Machine Processing	\N	\N	2026-04-15 00:00:00	2026-04-03 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 09:33:35.506	2026-05-26 17:20:53.591
cmpmftxue008biausnqrgrnb8	cmpm2d1mf000hiausxnjzupt7	Narrative Report	\N	\N	2026-04-15 00:00:00	2026-04-13 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 09:33:35.51	2026-05-26 17:20:53.593
cmpmftxuj008diausv0o2sdqz	cmpm2d1ml000jiaus0i2ojuzx	Enumeration	\N	\N	2026-04-30 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	0	t	2026-05-26 09:33:35.516	2026-05-26 17:20:53.599
cmpmftxur008fiausm0jb8axv	cmpm2d1ml000jiaus0i2ojuzx	Machine Processing	\N	\N	2026-05-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 09:33:35.523	2026-05-26 17:20:53.601
cmpmftxuu008hiaust0mxye9h	cmpm2d1ml000jiaus0i2ojuzx	Narrative Report	\N	\N	2026-05-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 09:33:35.526	2026-05-26 17:20:53.604
cmpmftxv0008jiause6n8ddkx	cmpm2d1mo000liausqeogy9jz	Enumeration	\N	\N	2026-05-31 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	0	t	2026-05-26 09:33:35.532	2026-05-26 17:20:53.609
cmpmftxv3008liauszuyuo4vu	cmpm2d1mo000liausqeogy9jz	Machine Processing	\N	\N	2026-06-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 09:33:35.535	2026-05-26 17:20:53.612
cmpmftxv6008niausbi1uxda4	cmpm2d1mo000liausqeogy9jz	Narrative Report	\N	\N	2026-06-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 09:33:35.538	2026-05-26 17:20:53.616
cmpmftxvc008piaus15b7bu27	cmpm2d1ms000niauspkq83zed	Enumeration	\N	\N	2026-06-30 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	0	t	2026-05-26 09:33:35.545	2026-05-26 17:20:53.621
cmpmftxvg008riausucybwcue	cmpm2d1ms000niauspkq83zed	Machine Processing	\N	\N	2026-07-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 09:33:35.548	2026-05-26 17:20:53.623
cmpmftxvj008tiauswfty0okd	cmpm2d1ms000niauspkq83zed	Narrative Report	\N	\N	2026-07-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 09:33:35.551	2026-05-26 17:20:53.631
cmpmftxvp008viausnqc9lyi9	cmpm2d1mw000piausoirmd6vi	Enumeration	\N	\N	2026-07-31 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	0	t	2026-05-26 09:33:35.557	2026-05-26 17:20:53.637
cmpmftxvr008xiausylmxdsib	cmpm2d1mw000piausoirmd6vi	Machine Processing	\N	\N	2026-08-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 09:33:35.56	2026-05-26 17:20:53.64
cmpmftxvu008ziausd5st18w0	cmpm2d1mw000piausoirmd6vi	Narrative Report	\N	\N	2026-08-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 09:33:35.562	2026-05-26 17:20:53.642
cmq7z3roa0146iahchnujraqk	cmq7z3ro40144iahcn8b8k58g	Enumeration	\N	\N	2025-09-05 00:00:00	2025-09-04 00:00:00	0	ON_TRACK	100	814	{}	\N	\N	f	0	t	2026-06-10 11:16:16.474	2026-06-10 11:16:16.474
cmq7z3rog0148iahcy42p0e5g	cmq7z3ro40144iahcn8b8k58g	Machine Processing	\N	\N	2025-10-10 00:00:00	2025-10-09 00:00:00	0	ON_TRACK	100	814	{}	\N	\N	f	1	t	2026-06-10 11:16:16.48	2026-06-10 11:16:16.48
cmq7z3roj014aiahcyo4ullnv	cmq7z3ro40144iahcn8b8k58g	Narrative Report	\N	\N	2025-10-27 00:00:00	2025-10-27 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-06-10 11:16:16.483	2026-06-10 11:16:16.483
cmq86v7uf003riab8dpn6iir7	cmplkm5zs001aiaegn3s1ybqj	January	\N	\N	\N	\N	0	ON_TRACK	\N	\N	{}	\N	\N	t	0	t	2026-06-10 14:53:34.455	2026-06-10 14:57:47.802
cmq7zi6x401cxiahccp49z0li	cmplkm5zs001aiaegn3s1ybqj	Narrative Report	\N	\N	2026-02-20 00:00:00	2026-02-16 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	3	t	2026-06-10 11:27:29.416	2026-06-10 14:57:47.813
cmpmftxwt009hiauso9rfr11v	cmpm2d1n5000viaus0p9ty0zc	Narrative Report	\N	\N	2026-12-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 09:33:35.598	2026-05-26 17:20:53.675
cmpmftxwz009jiauslftjgxkk	cmpm2d1n8000xiaus88hlh1rc	Enumeration	\N	\N	2026-11-30 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	0	t	2026-05-26 09:33:35.603	2026-05-26 17:20:53.681
cmpmftxx2009liausga6m7ubh	cmpm2d1n8000xiaus88hlh1rc	Machine Processing	\N	\N	2026-12-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 09:33:35.606	2026-05-26 17:20:53.684
cmpmftxx5009niausw53to3vl	cmpm2d1n8000xiaus88hlh1rc	Narrative Report	\N	\N	2026-12-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 09:33:35.609	2026-05-26 17:20:53.686
cmpmftxxb009piaus40x8luwt	cmpm2d1nb000ziaus7vraaotz	Enumeration	\N	\N	2026-12-31 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	0	t	2026-05-26 09:33:35.615	2026-05-26 17:20:53.696
cmpmftxxd009riausxqn1j510	cmpm2d1nb000ziaus7vraaotz	Machine Processing	\N	\N	2027-01-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	1	t	2026-05-26 09:33:35.618	2026-05-26 17:20:53.699
cmpmftxxg009tiausbqzftteh	cmpm2d1nb000ziaus7vraaotz	Narrative Report	\N	\N	2027-01-15 00:00:00	\N	0	ON_TRACK	\N	\N	{}	\N	\N	f	2	t	2026-05-26 09:33:35.62	2026-05-26 17:20:53.702
cmq87oi0x00ifiab83kxolo8a	cmq87oi0j00i7iab8uncvoz88	Data Encoding	\N	\N	2026-03-31 00:00:00	2026-01-27 00:00:00	0	ON_TRACK	103	103	{}	\N	\N	f	3	t	2026-06-10 15:16:20.674	2026-06-11 00:44:46.44
cmq87oi1000ihiab8i58g2wy5	cmq87oi0j00i7iab8uncvoz88	Narrative Report	\N	\N	2026-02-11 00:00:00	2026-02-10 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	4	t	2026-06-10 15:16:20.677	2026-06-11 00:44:46.443
cmqhvbtq001sxiawoxh4olu9b	cmqhvbtpv01sviawo4jnykejy	Enumeration	\N	\N	2026-03-02 00:00:00	2026-02-28 00:00:00	0	ON_TRACK	100	1532	{}	\N	\N	f	0	t	2026-06-17 09:28:15.672	2026-06-17 09:43:04.199
cmqhvbtq601sziawoofdh5nfc	cmqhvbtpv01sviawo4jnykejy	Processing	\N	\N	2026-03-27 00:00:00	2026-03-25 00:00:00	0	ON_TRACK	100	1532	{}	\N	\N	f	1	t	2026-06-17 09:28:15.678	2026-06-17 09:43:04.202
cmq87oi0n00i9iab84shs18c1	cmq87oi0j00i7iab8uncvoz88	Distribution	\N	\N	\N	\N	0	ON_TRACK	103	103	{}	\N	\N	f	0	t	2026-06-10 15:16:20.663	2026-06-11 00:44:46.43
cmq87oi0r00ibiab8nou5q47q	cmq87oi0j00i7iab8uncvoz88	Collection	\N	\N	\N	\N	0	ON_TRACK	103	103	{}	\N	\N	f	1	t	2026-06-10 15:16:20.668	2026-06-11 00:44:46.435
cmq87oi0v00idiab8stdkp5jr	cmq87oi0j00i7iab8uncvoz88	Manual Processing	\N	\N	\N	\N	0	ON_TRACK	103	103	{}	\N	\N	f	2	t	2026-06-10 15:16:20.671	2026-06-11 00:44:46.437
cmq87oi1300ijiab80koxuuc8	cmq87oi0j00i7iab8uncvoz88	Financial Report	\N	\N	2026-02-26 00:00:00	2026-02-16 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	5	t	2026-06-10 15:16:20.679	2026-06-11 00:44:46.445
cmq8rzi7n00driadwd8gyqwfd	cmq8rzi7k00dpiadwldvrzqw4	Distribution	\N	\N	\N	\N	0	ON_TRACK	100	158	{}	\N	\N	f	0	t	2026-06-11 00:44:46.452	2026-06-11 00:44:46.452
cmq8rzi7r00dtiadwrnuayrra	cmq8rzi7k00dpiadwldvrzqw4	Collection	\N	\N	\N	\N	0	ON_TRACK	94.3	149	{}	\N	\N	f	1	t	2026-06-11 00:44:46.455	2026-06-11 00:44:46.455
cmq8rzi7u00dviadwatkd2eg4	cmq8rzi7k00dpiadwldvrzqw4	Manual Processing	\N	\N	\N	\N	0	ON_TRACK	94.3	149	{}	\N	\N	f	2	t	2026-06-11 00:44:46.458	2026-06-11 00:44:46.458
cmq8rzi7w00dxiadwsdccqrbl	cmq8rzi7k00dpiadwldvrzqw4	Data Encoding	\N	\N	2026-06-30 00:00:00	2026-04-30 00:00:00	0	ON_TRACK	94.3	149	{}	\N	\N	f	3	t	2026-06-11 00:44:46.461	2026-06-11 00:44:46.461
cmq8rzi7z00dziadwmq99kpm0	cmq8rzi7k00dpiadwldvrzqw4	Narrative Report	\N	\N	2026-05-15 00:00:00	2026-05-12 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	4	t	2026-06-11 00:44:46.463	2026-06-11 00:44:46.463
cmq8rzi8100e1iadw22k8obrh	cmq8rzi7k00dpiadwldvrzqw4	Financial Report	\N	\N	2026-06-30 00:00:00	2026-06-12 00:00:00	0	ON_TRACK	\N	\N	{}	\N	\N	f	5	t	2026-06-11 00:44:46.466	2026-06-11 00:44:46.466
\.


--
-- Data for Name: Room; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Room" (id, name, "isAvailable", "unavailableReason", "isActive", "createdAt", "updatedAt") FROM stdin;
room_training	Training Room	t	\N	t	2026-05-28 13:30:52.976	2026-05-28 13:30:52.976
room_pantry_1	Pantry 1	t	\N	t	2026-05-28 13:30:52.976	2026-05-28 13:30:52.976
room_pantry_2	Pantry 2	t	\N	t	2026-05-28 13:30:52.976	2026-05-28 13:30:52.976
room_conference	Conference Room	f	Being used as CBMS Processing Room	t	2026-05-28 13:30:52.976	2026-05-28 05:46:29.083
\.


--
-- Data for Name: RoomReservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RoomReservation" (id, "roomId", "requesterPersonnelId", "requestedByUserId", "reservationType", "startDate", "endDate", "halfDaySlot", purpose, remarks, status, "approvedById", "approvedAt", "rejectedById", "rejectedAt", "rejectionReason", "cancelledAt", "calendarActivityId", "createdAt", "updatedAt") FROM stdin;
cmpp40flj000xiafk3c3b50ct	room_training	cmpmaayyh0049iausqyybqoai	cmpp3gnhz0007iafkfwlwufi4	MULTIPLE_DAYS	2026-05-31 16:00:00	2026-06-02 16:00:00	\N	Training for PhilSys	\N	CANCELLED	cmplkm5x70000iaeg6ej70tgq	2026-05-28 06:26:26.488	\N	\N	\N	2026-06-03 12:26:48.073	\N	2026-05-28 06:26:01.592	2026-06-03 12:26:48.075
cmpy28qfe0002iaecqowhu7bh	room_pantry_1	cmpmaayyh0049iausqyybqoai	cmpp3gnhz0007iafkfwlwufi4	HALF_DAY	2026-06-09 16:00:00	2026-06-09 16:00:00	MORNING	Training for Super Saiyan	\N	REJECTED	\N	\N	cmplkm5x70000iaeg6ej70tgq	2026-06-03 13:12:32.325	Gonna use it for higher priority event	\N	\N	2026-06-03 12:46:25.227	2026-06-03 13:12:32.327
cmpy5k34e006fiaeck4wowo3u	room_training	cmpmaayyh0049iausqyybqoai	cmpp3gnhz0007iafkfwlwufi4	SINGLE_DAY	2026-06-07 16:00:00	2026-06-07 16:00:00	\N	test	\N	APPROVED	cmplkm5x70000iaeg6ej70tgq	2026-06-03 14:46:11.457	\N	\N	\N	\N	cmpy6irde009jiaecqkfxjyd1	2026-06-03 14:19:13.742	2026-06-03 14:46:11.481
cmpy5j8v70068iaecnybvds3e	room_pantry_2	cmpmaayyh0049iausqyybqoai	cmpp3gnhz0007iafkfwlwufi4	HALF_DAY	2026-06-04 16:00:00	2026-06-04 16:00:00	MORNING	test	\N	APPROVED	cmplkm5x70000iaeg6ej70tgq	2026-06-03 14:46:13.855	\N	\N	\N	\N	cmpy6it7v009qiaecfadtsznd	2026-06-03 14:18:34.531	2026-06-03 14:46:13.871
cmpy5igz80061iaecxylz0rmu	room_pantry_1	cmpmaayyh0049iausqyybqoai	cmpp3gnhz0007iafkfwlwufi4	MULTIPLE_DAYS	2026-06-03 16:00:00	2026-06-04 16:00:00	\N	Training	\N	APPROVED	cmplkm5x70000iaeg6ej70tgq	2026-06-03 15:57:53.812	\N	\N	\N	\N	cmpwh4qfg02f7ia40yjrn95k3	2026-06-03 14:17:58.388	2026-06-03 15:57:53.813
\.


--
-- Data for Name: SpecialOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SpecialOrder" (id, "referenceNo", "soNumber", "assignedDate", "activityDate", purpose, destination, remarks, status, "locationType", "calendarActivityId", "createdAt", "updatedAt", "activityDateString") FROM stdin;
cmpw9vzpa045yian42agvgnc4	26PSO43-TO-054	2026-054	2026-02-01 16:00:00	2026-02-02 16:00:00	To serve as Resource Speaker in the Training Workshop on CBMS Module 3B: Utilization of CBMS Data in the Comprehensive Development Plan	Chali Beach Resort and Hotel, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4o4z01qqia40c0qrw4r6	2026-06-02 06:44:55.294	2026-06-02 10:07:37.531	February 03, 2026
cmpw9vzq00464ian4cho74edg	26PSO43-TO-055	2026-055	2026-02-02 16:00:00	2026-02-02 16:00:00	Fisheries Survey Supervision	Manticao and Magsaysay			OUTSIDE_OFFICE	cmpwh4o5u01quia40l9h9z4ft	2026-06-02 06:44:55.321	2026-06-02 10:07:37.562	February 03-28, 2026
cmpw9vzql0468ian42obyzkp0	26PSO43-TO-056	2026-056	2026-02-02 16:00:00	2026-02-08 16:00:00	Attend the Civil Registration Stakeholders' Appreciation Day	El Salvador, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4o7001r2ia40pgdanlnv	2026-06-02 06:44:55.342	2026-06-02 10:07:37.603	February 09, 2026
cmpw9vzrj046gian47dxe9tl4	26PSO43-TO-057	2026-057	2026-02-02 16:00:00	2026-02-08 16:00:00	Conduct Second Pilot Test on Grid-Based Frame Address System Application to 2025 Labor Force Survey and the July 2025 Family Income and Expenditiure Survey Second Visit Briefing	Pearlmont Hotel, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4o7p01r6ia40v95gbmnz	2026-06-02 06:44:55.375	2026-06-02 10:07:37.625	February 09, 2026
cmpw9vzrx046kian4ykjxd0ri	26PSO43-TO-058	2026-058	\N	2026-03-07 16:00:00	Attend the Single Parents Association - Learning Session on Labor Laws for the Corporate social Responsibility - March 2026	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4o8c01rcia40iw77nf28	2026-06-02 06:44:55.39	2026-06-02 10:07:37.65	March 08, 2026
cmpw9vzsi046qian4lghm00z0	26PSO43-TO-059	2026-059	2026-02-09 16:00:00	2026-02-17 16:00:00	To conduct Church Visit and Ocular Inspection and Distribution of Cheque	Kinoguitan, Binuangan, and Jasaan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4o9801rkia40d69n2y71	2026-06-02 06:44:55.41	2026-06-02 10:07:37.682	February 18, 2026
cmpw9vzt7046yian4oyf5lh3v	26PSO43-TO-060	2026-060	2026-02-09 16:00:00	2026-02-12 16:00:00	To Attend the City Council Meeting on the Boundary Dispute of Barangays	City Hall, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4ocg01rsia40lisbrivl	2026-06-02 06:44:55.435	2026-06-02 10:07:37.8	February 13, 2026
cmpw9vzu30476ian45zj9w5al	26PSO43-TO-061	2026-061	2026-02-09 16:00:00	2026-02-19 16:00:00	To Attend the Philippine Association of Building Officials (PABO) CDO-Mis. Or Monthly Covening	Kinoguitan and Balingoan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4odf01ryia407ww6mhlx	2026-06-02 06:44:55.467	2026-06-02 10:07:37.833	February 20, 2026
cmpw9vzuw047cian49f80u9b4	26PSO43-TO-062	2026-062	2026-02-10 16:00:00	2026-02-12 16:00:00	Attend Mass Wedding	City Jail, Lumbia, Cagayan de Oro City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4oek01saia400uxb5pwk	2026-06-02 06:44:55.496	2026-06-02 10:07:37.874	February 13, 2026
cmpw9vzwu047wian49b8y9mbu	26PSO43-TO-064	2026-064	2026-02-11 16:00:00	2026-02-13 16:00:00	To Participate in the conduct of Mobile Regitration and Implementation of BRAP during the KSB "Klarex nga Serbisyo sa Baryo"	Barangay Macabalan, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4oge01sqia400mkj0ezw	2026-06-02 06:44:55.566	2026-06-02 10:07:37.94	February 14, 2026
cmpw9vzxi0484ian4gkbxg47y	26PSO43-TO-065	2026-065	2026-02-12 16:00:00	2026-02-17 16:00:00	To conduct Community-Based  Monitoring System (CBMS) Training on Basic Statistics for Local Government Units	Pearlmont Hotel, Brgy. 35, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4oh101suia40djnr6rxb	2026-06-02 06:44:55.59	2026-06-02 10:07:37.962	February 18-20, 2026
cmpw9vzy00488ian4klt6afry	26PSO43-TO-066	2026-066	2026-02-12 16:00:00	2026-02-15 16:00:00	To Conduct National ID Mobile Registration	Lagonglong, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4ohs01t0ia40vg001v2l	2026-06-02 06:44:55.608	2026-06-02 10:07:37.99	February 16, 2026
cmpw9vzyn048eian4i6w5rfg2	26PSO43-TO-067	2026-067	2026-02-15 16:00:00	2026-02-19 16:00:00	To Conduct 2024 CBMS Data Presentation	Gingoog City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4oiu01t8ia40zb7pdh2h	2026-06-02 06:44:55.632	2026-06-02 10:07:38.029	February 20, 2026
cmpw9vzzl048mian4wzv1uv8y	26PSO43-TO-068	2026-068	2026-02-15 16:00:00	2026-02-17 16:00:00	To Distribute Cheque for the 2024 POPCEN-CBMS Honorarium of Barangay Captains	Opol and El Salvador City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4ojo01teia40j03rg1vk	2026-06-02 06:44:55.665	2026-06-02 10:07:38.058	February 18, 2026
cmpw9w00d048sian4u23eegjo	26PSO43-TO-069	2026-069	2026-02-15 16:00:00	2026-02-17 16:00:00	To Distribute Letter for the COnduct of the 36th Civil Registration Month Culminating Activities	El Salvador City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4okh01tkia405uo3wrye	2026-06-02 06:44:55.693	2026-06-02 10:07:38.086	February 18, 2026
cmpw9w017048yian4g37tknu0	26PSO43-TO-070	2026-070	2026-02-15 16:00:00	2026-02-22 16:00:00	To Conduct Port Visitation for the Domestic Trade Statistics and Collection of Building Permits	Tagoloan, Gingoog City, Opol, Lugait, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4ols01twia40c9o5vsbi	2026-06-02 06:44:55.723	2026-06-02 10:07:38.133	February 23-24, 2026
cmpw9w02n049aian4ughmdtv3	26PSO43-TO-071	2026-071	2026-02-15 16:00:00	2026-02-17 16:00:00	To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	El Salvador City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4omk01u2ia40lgaxsmfs	2026-06-02 06:44:55.776	2026-06-02 10:07:38.162	February 18, 2026
cmpw9w03m049gian4i6bgf3ez	26PSO43-TO-072	2026-072	2026-02-19 16:00:00	2026-02-23 16:00:00	To Conduct 2025 ULAFO LMLFC Field Verification	Besigan, Tagpangi, Bayanga, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4ona01u8ia4073rumvpc	2026-06-02 06:44:55.81	2026-06-02 10:07:38.187	February 24, 2026
cmpw9w049049mian40ia4ce49	26PSO43-TO-073	2026-073	2026-02-19 16:00:00	2026-02-20 16:00:00	To Attend KLAREX nga SERBISYO SA BARYO (KSB) "Kasalan sa Baryo" and To Conduct PhilSys and BRAP Mobile Registration and Awarading of BRAP Beneficiaries	San Simon, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4ood01ukia40ovh6ipy4	2026-06-02 06:44:55.833	2026-06-02 10:07:38.226	February 21, 2026
cmpw9w05d049yian45yie0chm	26PSO43-TO-074	2026-074	2026-02-22 16:00:00	2026-02-28 16:00:00	Bi-weekly CPI Collection	Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4op701usia40jage9r2s	2026-06-02 06:44:55.873	2026-06-02 10:07:38.268	March 01-05, 15-17, 2026
cmpw9w06e04a6ian4ceoodajv	26PSO43-TO-075	2026-075	2026-02-22 16:00:00	2026-02-28 16:00:00	Weekly CPI Collection for Petroleum and LPG	Gusa, Lapasan, Camaman-an, Carmen and Kauswagan, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4oq401uzia401ohihwqm	2026-06-02 06:44:55.911	2026-06-02 10:07:38.289	March 01-31, 2026
cmpw9vzij044aian4maydtzw6	26PSO43-TO-049	2026-049	2026-01-28 16:00:00	2026-02-23 16:00:00	Solemnizing Officer Seminar	El Salvador, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4nyq01paia40rdf08vid	2026-06-02 06:44:55.051	2026-06-02 10:07:37.306	February 24, 2026
cmpw9vzka044oian4jr17t1f0	26PSO43-TO-050	2026-050	2026-01-28 16:00:00	2026-02-26 16:00:00	Conduct 36th CRM Culmination Activities	El Salvador, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4o1701q2ia40alh5ie6g	2026-06-02 06:44:55.114	2026-06-02 10:07:37.396	February 27, 2026
cmpw9vzmr045gian4u0gs1wyb	26PSO43-TO-051	2026-051	2026-01-29 16:00:00	2026-01-31 16:00:00	SUPERVISION FOR MONTHLY PALAY & CORN MONITORING SYSTEM, RICE AND CORN STOCKS SURVEY CPI	Cagayan de Oro City to Gingoog City			OUTSIDE_OFFICE	cmpwh4o1z01q6ia40u32xnakq	2026-06-02 06:44:55.203	2026-06-02 10:07:37.421	February 01-13, 2026 (Any 03 Days)
cmpw9vznc045kian4vcvjf4g4	26PSO43-TO-052	2026-052	2026-02-01 16:00:00	2026-02-09 16:00:00	Coordination Meeting for the basic Statistics Training	MSU - Naawan			OUTSIDE_OFFICE	cmpwh4o3401qeia40phd7zw5w	2026-06-02 06:44:55.224	2026-06-02 10:07:37.462	February 10, 2026
cmpwh4rjn02q4ia402uoak26n	26PSO43-TO-206	2026-206	2026-05-28 16:00:00	2026-05-31 16:00:00	Conduct Training on 2025 Household Survey on Domestic Visitor (HSDV) Data Processing	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	\N	2026-06-02 10:07:41.939	2026-06-02 10:07:41.953	June 01-03, 2026
cmpw9w09u04b0ian4mfy98dmp	26PSO43-TO-080	2026-080	2026-02-24 16:00:00	2026-02-25 16:00:00	To Conduct 2025 FIES Visit 2 Data Processing 3rd Level Training	PSA MIsamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4ou601wnia405xhc1rt4	2026-06-02 06:44:56.034	2026-06-02 10:07:38.436	February 26-27, 2025
cmpw9w0br04c0ian4ib6cxah3	26PSO43-TO-081	2026-081	2026-02-24 16:00:00	2026-03-08 16:00:00	To Conduct 2025 FUNGAS Data Processing 3rd Level Training	PSA MIsamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4ove01x9ia403512p8mq	2026-06-02 06:44:56.104	2026-06-02 10:07:38.479	March 09-10, 2026
cmpw9w0d204cmian4lwq3vefg	26PSO43-TO-082	2026-082	2026-02-24 16:00:00	2026-03-05 16:00:00	To Conduct March 2026 LFS 3rd Level Training	PSA MIsamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4ow401xlia40ffnt76tk	2026-06-02 06:44:56.15	2026-06-02 10:07:38.506	March 06, 2026
cmpw9w0dz04cyian41b5m0nzh	26PSO43-TO-083	2026-083	2026-02-25 16:00:00	2026-02-27 16:00:00	To Attend KLAREX nga SERBISYO SA BARYO (KSB) "Kasalan sa Baryo" and To Conduct PhilSys and BRAP Mobile Registration and Awarading of BRAP Beneficiaries	Nazareth, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4ox001xxia40mzax7om4	2026-06-02 06:44:56.183	2026-06-02 10:07:38.538	February 28, 2026
cmpw9w0f704daian4m7dn6j9i	26PSO43-TO-084	2026-084	2026-02-25 16:00:00	2026-03-02 16:00:00	To Conduct Fisheries Survey Supervision, Field Verification and Spot Checking	Manticao to Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4oxj01y1ia40j9a0s1y7	2026-06-02 06:44:56.228	2026-06-02 10:07:38.555	March 03-31, 2026 (Any 10 Days)
cmpw9w0j104ebian43xj9si1b	26PSO43-TO-090	2026-090	2026-03-02 16:00:00	2026-03-03 16:00:00	To Attend National Women's Month 2026 Kick-Off Ceremony  Re-echo on Cybersecurity	PSA MIsamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4p2r01zhia4037zyz8qe	2026-06-02 06:44:56.365	2026-06-02 10:07:38.742	March 04, 2026
cmpw9w0ft04deian4i55roifm	26PSO43-TO-085	2026-085	2026-02-25 16:00:00	2026-03-03 16:00:00	To Collect WPS	Bulua Landing Center, Bulua, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4oy201y5ia4054x1djvu	2026-06-02 06:44:56.249	2026-06-02 10:07:38.624	March 04,06,09,11,13,16,18,20,23,25,27,30, 2026
cmpw9w0g104dhian44nruhhfo	26PSO43-TO-086	2026-086	2026-02-25 16:00:00	2026-02-28 16:00:00	To Conduct Field Supervision for Monthly Palay and Corn Monitoring System, Rice and Corn Stock Survey and Retail Price Survey	Cagayan de Oro City to Lugait, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4ozx01ykia40jw7u56gb	2026-06-02 06:44:56.258	2026-06-02 10:07:38.643	March 01-13,2026 (Any 03 Days)
cmpw9w0gn04dlian4p2ggd11h	26PSO43-TO-087	2026-087	2026-02-25 16:00:00	2026-03-02 16:00:00	To Conduct Coordination for Serbisyo Para Kai Juana in Celebration of the 2026 National Women's Month	Alubijid, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4p0k01yqia404ti8xil7	2026-06-02 06:44:56.279	2026-06-02 10:07:38.669	March 03 and 06, 2026
cmpw9w0hd04drian41r2bpewn	26PSO43-TO-088	2026-088	2026-03-01 16:00:00	2026-03-02 16:00:00	To Participate in the conduct of Mobile Regitration and Implementation of BRAP	Xavier University - Ateneo de Cagayan			OUTSIDE_OFFICE	cmpwh4p1d01yzia40rqdx29yd	2026-06-02 06:44:56.306	2026-06-02 10:07:38.699	March 03 and 06, 2026
cmpw9w0i504dzian4xop9lm5o	26PSO43-TO-089	2026-089	2026-03-02 16:00:00	2026-03-15 16:00:00	To Conduct CFS Distribution,CPI Spotcheck, BP Follow Up	Different Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4p2801zcia40n9z8s5qb	2026-06-02 06:44:56.334	2026-06-02 10:07:38.728	March 16-17, 19-20, 2026
cmpw9w0ji04efian481kq97rc	26PSO43-TO-091	2026-091	2026-03-04 16:00:00	2026-03-08 16:00:00	To Pick-up Airways Manifests for Domestic Trade Statistics	Laguindingan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4p3h01zpia40wg2be8gg	2026-06-02 06:44:56.382	2026-06-02 10:07:38.769	March 09, 2026
cmpw9w0k704enian4wggh6uw9	26PSO43-TO-092	2026-092	2026-03-02 16:00:00	2026-03-04 16:00:00	To Attend the 3rd Level Fisheries Training	PSA MIsamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4p4i020bia405g953ztg	2026-06-02 06:44:56.408	2026-06-02 10:07:38.806	March 05, 2026
cmpw9w0lk04f9ian42mqx53vz	26PSO43-TO-093	2026-093	2026-03-04 16:00:00	2026-03-15 16:00:00	To Conduct Training on R Programming and Data Management Using Community-Based Monitoring System (CBMS) Data	Pearlmont Hotel, Brgy. 35, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4p5t020ria40nwqrqhe9	2026-06-02 06:44:56.457	2026-06-02 10:07:38.854	March 16-20, 2025
cmpw9w0ne04fpian4nbwqrfjj	26PSO43-TO-094	2026-094	2026-03-05 16:00:00	2026-03-06 16:00:00	KSB and Special Registration (NID)	Bayanga, Mambuaya, & Tagoloan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4p6i0211ia40x6c6alkm	2026-06-02 06:44:56.522	2026-06-02 10:07:38.879	March 07, 2026
cmpw9w0o604fzian4xxheze4w	26PSO43-TO-095	2026-095	2026-03-05 16:00:00	2026-03-07 16:00:00	MARCH 2026 LFS Field Supervision	Alubijid, El Salvador City, Manticao, Talisayan. Gingoog City and Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4p760217ia403nd2ikwv	2026-06-02 06:44:56.55	2026-06-02 10:07:38.902	March 08-31, 2026 (Any 02 Days)
cmpw9w0p004g5ian4ar99kn7w	26PSO43-TO-096	2026-096	2026-03-05 16:00:00	2026-03-15 16:00:00	To Conduct LRCO Evaluation and Church Visit	Binuangan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4p7z021fia40e5tg2t1a	2026-06-02 06:44:56.58	2026-06-02 10:07:38.933	March 16, 2026
cmpw9w0px04gdian4cc80oev1	26PSO43-TO-097	2026-097	\N	2026-03-23 16:00:00	To Conduct Local Civil Registry Office (LRCO) Evaluation	Laguindingan and Gitagum, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4p8t021nia40rnaanit0	2026-06-02 06:44:56.614	2026-06-02 10:07:38.963	March 24, 2026
cmpw9w0sc04hbian4gbzrcgf7	26PSO43-TO-099	2026-099	2026-03-05 16:00:00	2026-03-15 16:00:00	To Conduct Other Crops Enumeration	Selected Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pb3022xia40i38gx3vx	2026-06-02 06:44:56.701	2026-06-02 10:07:39.043	March 16-31, 2026
cmpw7i0bh038pian4e6ajbq6d	26PSO43-TO-106	2026-106	2026-03-08 16:00:00	2026-03-16 16:00:00	To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	Minalwang, Claveria, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pg4024jia40qso3ceg1	2026-06-02 05:38:03.678	2026-06-02 10:07:39.227	March 17-18, 2026
cmpw7i10103fgian4vconqnp2	26PSO43-TO-134	2026-134	2026-03-25 16:00:00	2026-04-05 16:00:00	Conduct Field Supervision for Monthly Palay and Corn Monitoring System, Rice and Corn Stocks Survey	Claveria, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4q2z02boia40oqsk6evm	2026-06-02 05:38:04.561	2026-06-02 10:07:40.047	April 06, 2026
cmpw7i1me03l4ian4ghvie0oq	26PSO43-TO-164	2026-164	2026-04-26 16:00:00	2026-04-30 16:00:00	To Conduct Field Supervision for Monthly Palay and Corn Monitoring System, Rice and Corn Stock Survey and Retail Price Survey	Cagayan de Oro City to Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qo902heia4069r0n696	2026-06-02 05:38:05.367	2026-06-02 10:07:40.814	May 01-15, 2026 (Any 04 Days)
cmpw9w06x04acian4jh88qhz7	26PSO43-TO-076	2026-076	2026-02-22 16:00:00	2026-03-03 16:00:00	To Collect Foreign Trade Documents	Bugo and Macabalan, Cagayan de Oro City and Tagoloan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4oqr01v5ia40nvsx8jf1	2026-06-02 06:44:55.929	2026-06-02 10:07:38.312	March 04-06, 2026 (Any 01 Day)
cmpw9w07l04aiian4bl1sx7al	26PSO43-TO-077	2026-077	2026-02-23 16:00:00	2026-02-24 16:00:00	To Conduct MISSI and PPS Provincial Level Training	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4or901v9ia400vhusrdl	2026-06-02 06:44:55.953	2026-06-02 10:07:38.329	February 25, 2026
cmpw9w08104amian4zmba4w9j	26PSO43-TO-078	2026-078	2026-02-23 16:00:00	2026-02-24 16:00:00	To Conduct Ocular Visit at Local Civil registry Office (LCRO)	Talisayan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4os101vhia40h1m88pcx	2026-06-02 06:44:55.969	2026-06-02 10:07:38.36	February 25, 2026
cmpw9w09104auian4qweziu5s	26PSO43-TO-079	2026-079	2026-02-24 16:00:00	2026-02-25 16:00:00	To Conduct 2026 MISSI and PPS Coordination and Distribution of Tokens	Different Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4osq01vnia40fq5q3ble	2026-06-02 06:44:56.005	2026-06-02 10:07:38.382	February 26-27, 2025
cmpw7i17w03haian4kuafgxin	26PSO43-TO-144	2026-144	2026-04-09 16:00:00	2026-04-12 16:00:00	Attend 3rd Level Training on 2025 Annual Survey of Philippine Business and Industry (ASPBI) and 2025 Survey of Tourism Establishment in the Philippines	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4q9g02dgia40z37kusgc	2026-06-02 05:38:04.844	2026-06-02 10:07:40.28	April 13-17, 2026
cmpw9vzvy047oian47w8zgyfz	26PSO43-TO-063	2026-063	2026-02-11 16:00:00	2026-02-12 16:00:00	To Participate in the conduct of Mobile Regitration and Implementation of BRAP	Covered Court, Barangay San Francisco De Asis, City of El Salvador, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4ofh01siia408xz5aw6a	2026-06-02 06:44:55.534	2026-06-02 10:07:37.907	February 13, 2026
cmpw7i1t403mlian4vz001zra	26PSO43-TO-174	2026-174	2026-05-05 16:00:00	2026-05-06 16:00:00	Conduct 2026 Community-Based Monitoring System (CBMS) Data Collection and Verification of the DSWD Social Protection Beneficiaries	Different Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qwc02j8ia40tvwwzfsp	2026-06-02 05:38:05.609	2026-06-02 10:07:41.104	May 07-29, 2026
cmpw9w0qx04glian4qour220v	26PSO43-TO-098	2026-098	2026-03-05 16:00:00	2026-03-08 16:00:00	To Attend the 3rd Level Training on Other Crops Survey	PSA MIsamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4p9z022dia4058snjufo	2026-06-02 06:44:56.649	2026-06-02 10:07:39.006	March 09-10, 2026
cmpw7hyfz02niian49smlxnkm	26PSO43-TO-027	2026-027	2026-01-19 16:00:00	2026-01-21 16:00:00	Conduct 4th Quarter QSPBI Data Collection	Gingoog City, Talisayan, Balingoan, Villanueva, Tagoloan, Misamis Oriental, and Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4n9m01itia40n5tl201h	2026-06-02 05:38:01.248	2026-06-02 10:07:36.398	January 22-23, 2026
cmpw7i0ks03b3ian4ygmhxu3o	26PSO43-TO-117	2026-117	2026-03-18 16:00:00	2026-03-30 16:00:00	To Attend the 3rd Level Training of April 2026 Quarterly Labor Force Survey (LFS)	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4ppc027oia40i0k9cipu	2026-06-02 05:38:04.012	2026-06-02 10:07:39.564	March 31-April 01, and April 06-07, 2026
cmpw7hytx02r4ian4qd5r02kw	26PSO43-TO-042	2026-042	2026-01-28 16:00:00	2026-02-10 16:00:00	Mobile Services (National ID and BRAP)	Salay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4noo01mkia40q6prwm10	2026-06-02 05:38:01.749	2026-06-02 10:07:36.942	February 11, 2026
cmpw7i0vs03ejian4yqw8rhpc	26PSO43-TO-127	2026-127	2026-03-25 16:00:00	2026-03-27 16:00:00	Conduct 1st Quarter 2026 Livestock and Poultry Survey: Establishment (LPS:E) Supervision	Cagayan de Oro City, Alubijid, Balingasag, Claveria, Gingoog City, Initao, Lagonglong, Magsaysay, Manticao, Medina, Opol, Salay, El Salvador City, Gitagum, Jasaan, Laguindingan, Naawan, and Villanueva, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pxy02agia400womkze8	2026-06-02 05:38:04.408	2026-06-02 10:07:39.866	March 28 - April 10, 2026 (Any 03 Days)
cmpw9vzok045sian4108trki8	26PSO43-TO-053	2026-053	2026-02-02 16:00:00	2026-02-07 16:00:00	February 2026 Labor Force Survey (LFS) Supervision	Balingasag, Magsaysay, City of Gingoog, Naawan, Tagoloan, Mis. Or, and CDOC			OUTSIDE_OFFICE	cmpwh4o3y01qkia40zyxlsacq	2026-06-02 06:44:55.268	2026-06-02 10:07:37.493	February 08-28, 2026
cmpw7hy9g02lzian41esx4eol	26PSO43-TO-020	2026-020	2026-01-15 16:00:00	2026-01-19 16:00:00	Conduct Local Civil Registry Office (LCRO) Evaluation and Conduct Church Visit and Ocular Inspection	Lagonglong and Salay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4n3801hcia40utuufvn9	2026-06-02 05:38:01.012	2026-06-02 10:07:36.171	January 20, 2026
cmpw7i11c03fqian4d84v9aa2	26PSO43-TO-136	2026-136	2026-04-05 16:00:00	2026-04-06 16:00:00	Conduct MISSI and PPS Distribution of Forms, Foreign Trade Collection, and QSPBI Coordination	Villanueva, Tagoloan, Cagayan de Oro City, El Salvador City, and Manticao, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4q4002byia403d75tcq0	2026-06-02 05:38:04.608	2026-06-02 10:07:40.085	April 07, 2026
cmpw7hy8e02lrian4j9ka88zf	26PSO43-TO-018	2026-018	2026-01-15 16:00:00	2026-01-16 16:00:00	Attend KLAREX nga SERBISYO SA BARYO (KSB) "KASALAN NG BAYAN" to Conduct  BRAP Mobile Registration and Awarding of BRAP Beneficiaries	Tagpangi, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4n1p01h0ia403jl1afzv	2026-06-02 05:38:00.974	2026-06-02 10:07:36.114	January 17, 2026
cmpw7hy7n02lhian42nd04i76	26PSO43-TO-017	2026-017	2026-01-14 16:00:00	2026-01-19 16:00:00	Transport National ID Registration Kits	Balingasag, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4n1201gwia40od5wkt48	2026-06-02 05:38:00.947	2026-06-02 10:07:36.091	January 20, 2026
cmpw7hxy902jdian4kr88ilye	26PSO43-TO-007	2026-007	2026-01-11 16:00:00	2026-01-12 16:00:00	Conduct Fisheries Survey Supervision	Manticao to Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4mrm01elia40k3iareiu	2026-06-02 05:38:00.61	2026-06-02 10:07:35.752	January 13-31, 2026 (Any 05 Days)
cmpw7hy0l02jtian4f7419x9f	26PSO43-TO-010	2026-010	2026-01-12 16:00:00	2026-01-22 16:00:00	Conduct 1st Quarter Consumer Expectations Survey (CES) Field Supervision	Gingoog City, Naawan, Balingasag, and Manticao			OUTSIDE_OFFICE	cmpwh4mug01f7ia40k8xjt7zh	2026-06-02 05:38:00.694	2026-06-02 10:07:35.862	January 23-24, 26-28, 2026
cmpw7hxvt02ixian4wijgc7aa	26PSO43-TO-004	2026-004	2026-01-05 16:00:00	2026-01-06 16:00:00	Conduct Fisheries Survey Verification	Balingasag, Talisayan, and Gingoog City, Misammis Oriental			OUTSIDE_OFFICE	cmpwh4mp201e5ia40n5582fci	2026-06-02 05:38:00.521	2026-06-02 10:07:35.661	January 07-09, 2026
cmpw7hy4802kjian46262anyr	26PSO43-TO-013	2026-013	2026-01-14 16:00:00	2026-02-05 16:00:00	Conduct February 2026 Labor Force Survey (LFS) 3rd Level Training	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4mxx01g2ia40vrj7prtz	2026-06-02 05:38:00.825	2026-06-02 10:07:35.98	February 06-07, 2026
cmpw7hxs302ibian4gxfopccw	26PSO43-TO-001	2026-001	2026-01-04 16:00:00	2026-01-05 16:00:00	2025 QSPBI - 4th Quarter Distrbution of Questionnaires	Tagoloan - Gingoog City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4mla01djia40atwh8mb3	2026-06-02 05:38:00.387	2026-06-02 10:07:35.527	January 06, 2026
cmpw7hy6002l3ian4927s3k97	26PSO43-TO-015	2026-015	2026-01-14 16:00:00	2026-01-18 16:00:00	Conduct 1st Quarter National ID Field Operation	Different Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4mzh01gcia40ihograqh	2026-06-02 05:38:00.889	2026-06-02 10:07:36.034	January 19 - March 31, 2026
cmpw7hxyx02jhian46dlm6rnq	26PSO43-TO-008	2026-008	2026-01-11 16:00:00	2026-01-12 16:00:00	Conduct Courtesy Call to Sample Barangay Landing Centers of Fishery Survey	Manticao to Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4msg01eria40cidbaf5d	2026-06-02 05:38:00.634	2026-06-02 10:07:35.784	January 13-16, 2026
cmpw7hxwk02j1ian489171d8t	26PSO43-TO-005	2026-005	2026-01-07 16:00:00	2026-01-13 16:00:00	Attend Solemnizing Officer Seminar	Villanueva, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4mq801edia40s0h2ays7	2026-06-02 05:38:00.548	2026-06-02 10:07:35.703	January 14, 2026
cmpw7hxt202ifian4p0kmihlx	26PSO43-TO-002	2026-002	2026-01-04 16:00:00	2026-01-06 16:00:00	Conduct Local Civil Registry Office (LCRO) Evaluation	Manticao and Lugait, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4mml01dria40o2rdusgs	2026-06-02 05:38:00.423	2026-06-02 10:07:35.574	January 07, 2026
cmpw7hy1z02k3ian4vj32hcj7	26PSO43-TO-011	2026-011	2026-01-13 16:00:00	2026-01-14 16:00:00	Conduct Collection and Coordination for QSPBI and MISSI PPS	Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4mvd01fcia40om2yn7ze	2026-06-02 05:38:00.744	2026-06-02 10:07:35.887	January 15, 2026
cmpw7hy5602kxian4633arzps	26PSO43-TO-014	2026-014	2026-01-14 16:00:00	2026-02-05 16:00:00	Conduct Second Pilot Testing on Grid-Based Frame Address System Application to 2025 Labor Force Survey (LFS) and 2025 Family Income Expenditure Survey (FIES) Second Visit Supervision	Balingoan, Gingoog City, Magsaysay, Medina, Talisayan, Claveria, Balingasag, Salay, Sugbongcogon, Kinoguitan, Lagonglong, Tagoloan, Villanueva, Jasaan, Cagayan de Oro City, El Salvador, Opol, Laguindingan, Initao, Naawan, Manticao, and Lugait, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4myw01g8ia403flpkrf5	2026-06-02 05:38:00.859	2026-06-02 10:07:36.014	February 06 - March 15, 2026 (Any 10 Days)
cmpw7hy6m02l7ian435icb3k6	26PSO43-TO-016	2026-016	2026-01-14 16:00:00	2026-01-18 16:00:00	Transport National ID Registration Kits	Opol, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4n0c01gmia40wnfvyz62	2026-06-02 05:38:00.91	2026-06-02 10:07:36.064	January 19, 2026
cmpw7hxzt02jnian46wjfytoe	26PSO43-TO-009	2026-009	2026-01-12 16:00:00	2026-01-18 16:00:00	Conduct January 2026 Labor Force Survey (LFS) and Family Income Expenditure Survey (FIES) Visit Field Supervision	Claveria, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4mt801exia405wfdsnsn	2026-06-02 05:38:00.665	2026-06-02 10:07:35.809	January 19, 2026
cmpw7hxxl02j9ian49qilwhn5	26PSO43-TO-006	2026-006	2026-01-07 16:00:00	2026-01-12 16:00:00	Conduct Church Visit and Ocular Inspection	Tagoloan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4mqy01ehia40vfhh9kyj	2026-06-02 05:38:00.585	2026-06-02 10:07:35.73	January 13, 2026
cmpw7hxu702inian4fm0zli6l	26PSO43-TO-003	2026-003	2026-01-04 16:00:00	2026-01-11 16:00:00	Attend an Appointment with City Mayor Cañosa for Proposed LGU Managed Outlet and Conduct Local Civil Registry Office (LCRO) Evaluation	Gingoog City, and Magsaysay, Misamis Orriental			OUTSIDE_OFFICE	cmpwh4mo401e1ia4067em941s	2026-06-02 05:38:00.464	2026-06-02 10:07:35.63	January 12, 2026
cmpw7hy2p02k7ian4yqu0w6tc	26PSO43-TO-012	2026-012	2026-01-13 16:00:00	2026-01-15 16:00:00	Conduct Turnover of the ECRVS Equipment	Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4mwt01foia40vztvjkjv	2026-06-02 05:38:00.769	2026-06-02 10:07:35.942	January 16, 2026
cmpw7hydt02mvian4fhq1ek38	26PSO43-TO-024	2026-024	2026-01-18 16:00:00	2026-01-21 16:00:00	Conduct Local Civil Registry Office (LCRO) Evaluation	Magsaysay and Medina, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4n7h01i8ia402gvxleje	2026-06-02 05:38:01.169	2026-06-02 10:07:36.325	January 22, 2026
cmpw7hyj502o4ian4ikwukhdj	26PSO43-TO-031	2026-031	2026-01-26 16:00:00	2026-01-27 16:00:00	January 2026 LFS Data Processing 3LT	Pantry 1, PSA MISOR. LKKS CENTER, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4ndp01jtia40logyw0e6	2026-06-02 05:38:01.361	2026-06-02 10:07:36.548	January 28, 2026
cmpw7hyer02n3ian41648drrz	26PSO43-TO-025	2026-025	2026-01-18 16:00:00	2026-01-19 16:00:00	Conduct National ID Mobile Registration	BJMP Male Dormitory, Lumbia, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4n8901ieia406hpg7adg	2026-06-02 05:38:01.203	2026-06-02 10:07:36.352	January 20, 2026
cmpw7hyfg02n9ian4j5lefgrh	26PSO43-TO-026	2026-026	2026-01-19 16:00:00	\N	Conduct Data Request for Provincial Product Account (PPA) and PSA-LGU Data Sharing (PLDS) Project and Collection of Building Permits	All Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	\N	2026-06-02 05:38:01.228	2026-06-02 10:07:36.355	29-30 Jan to 02 Feb 2026
cmpw7hygu02noian4lgl9p5al	26PSO43-TO-028	2026-028	2026-01-19 16:00:00	2026-01-25 16:00:00	Conduct BRAP Mobile Registration and Awarding of BRAP Beneficiaries	Igpit, Opol, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4na901ixia404rb8n5x1	2026-06-02 05:38:01.278	2026-06-02 10:07:36.424	January 26, 2026
cmpw7hyhe02nsian4bmiqtb43	26PSO43-TO-029	2026-029	2026-01-22 16:00:00	2026-01-23 16:00:00	Klarex nga Serbisyo sa Baryo (KSB)	Camaman-an, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4nay01j1ia40ih4ccf9j	2026-06-02 05:38:01.298	2026-06-02 10:07:36.449	January 24, 2026
cmpw7hyi002nwian433hcehl4	26PSO43-TO-029A	2026-29A	2026-01-22 16:00:00	2026-02-06 16:00:00	To Participate in the conduct of Mobile Registration during the KSB	Iponan, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4nbr01j5ia4020wbnjw1	2026-06-02 05:38:01.32	2026-06-02 10:07:36.479	February 07, 2026
cmpw7hyip02o0ian47jztef6j	26PSO43-TO-030	2026-030	2026-01-22 16:00:00	2026-01-30 16:00:00	Participate in the Municipal Civic Parade in celebration with the 7th Cantago Festival	Tagoloan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4ncd01j9ia40n2m30unh	2026-06-02 05:38:01.345	2026-06-02 10:07:36.498	January 31, 2026
cmpw7hykh02ooian4fkd1jal0	26PSO43-TO-032	2026-032	2026-01-27 16:00:00	2026-01-31 16:00:00	Weekly CPI Collection for Petroleum and LPG	Gusa, Lapasan, Camaman-an, Carmen and Kauswagan, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4nef01jzia40p26bh4j3	2026-06-02 05:38:01.409	2026-06-02 10:07:36.572	February 01-28, 2026
cmpw7hyl002ouian46f95otlm	26PSO43-TO-033	2026-033	2026-01-27 16:00:00	2026-01-31 16:00:00	Bi-weekly CPI Collection	Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4nfi01k7ia40fuk8ipkg	2026-06-02 05:38:01.428	2026-06-02 10:07:36.618	February 01-05, 15-17, 2026
cmpw7hylz02p2ian4yv3xyofc	26PSO43-TO-034	2026-034	\N	2026-02-05 16:00:00	Collect Foreign Trade Documents	Bugo, Macabalan, Cagayan de Oro City, Tagoloan			OUTSIDE_OFFICE	cmpwh4ngd01keia40kgoe623z	2026-06-02 05:38:01.463	2026-06-02 10:07:36.643	February 06, 2026
cmpw7hymo02p8ian4nf17i4ug	26PSO43-TO-035	2026-035	\N	2026-02-01 16:00:00	Conduct January 2026 Labor Force Survey (LFS) and 2025 Family Income Expenditure Survey (FIES) Visit 2 Retrieval of Data and Documents	Gingoog City, Medina, Talisayan, Balingoan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4nh301kkia409ffr6k0z	2026-06-02 05:38:01.488	2026-06-02 10:07:36.667	February 02, 2026
cmpw7hync02peian4tqx1muru	26PSO43-TO-036	2026-036	\N	2026-02-02 16:00:00	Conduct Roll out of Administrative Petition for Correction Automated System (APCAS)	City Civil Registry Office (CCRO), Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4nig01kyia40yvvtagh5	2026-06-02 05:38:01.512	2026-06-02 10:07:36.72	February 03-05, 2026
cmpw7hyot02psian4zc94n9c9	26PSO43-TO-037	2026-037	2026-01-28 16:00:00	2026-02-01 16:00:00	Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	Libertad and Manticao, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4njh01l6ia4017k6cmv7	2026-06-02 05:38:01.565	2026-06-02 10:07:36.755	February 02, 2026
cmpw7hypm02q0ian4hyxsayx8	26PSO43-TO-038	2026-038	2026-01-28 16:00:00	2026-01-31 16:00:00	WPS COLLECTION	Bulua, Cagayan de Oo City			OUTSIDE_OFFICE	cmpwh4nk701laia40wlxdatjx	2026-06-02 05:38:01.595	2026-06-02 10:07:36.782	February 01-28, 2026
cmpw7hyq602q4ian4rjlt92h0	26PSO43-TO-039	2026-039	2026-01-28 16:00:00	2026-02-03 16:00:00	WPS COLLECTION	Salay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4nlc01lmia402r0tyl93	2026-06-02 05:38:01.614	2026-06-02 10:07:36.823	February 04, 2026
cmpw7hyre02qgian4sl2f0y85	26PSO43-TO-040	2026-040	2026-01-28 16:00:00	2026-02-09 16:00:00	CSR AND GIVING PSA COM & COLB TO MALE PDL AT LUMBIA BJMP	Lumbia, Cagayan de Oro City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4nmw01m2ia4004u4rj7y	2026-06-02 05:38:01.659	2026-06-02 10:07:36.879	February 10, 2026
cmpw7hysz02qwian4cyv2rt7w	26PSO43-TO-041	2026-041	2026-01-28 16:00:00	2026-02-10 16:00:00	Attend Mass Wedding	Gingoog City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4nnp01maia405lra7im0	2026-06-02 05:38:01.715	2026-06-02 10:07:36.907	February 11, 2026
cmpw7hyuu02reian4z5h0u2mh	26PSO43-TO-043	2026-043	2026-01-28 16:00:00	2026-02-13 16:00:00	Attend Mass Wedding	Manticao, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4npq01msia407rmf1nrw	2026-06-02 05:38:01.783	2026-06-02 10:07:36.98	February 14, 2026
cmpw7hyvw02rmian4b9za0p4w	26PSO43-TO-044	2026-044	2026-01-28 16:00:00	2026-02-13 16:00:00	Attend Mass Wedding	Talisayan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4nql01n0ia40prlrxun2	2026-06-02 05:38:01.82	2026-06-02 10:07:37.01	February 14, 2026
cmpw7hywq02ruian4x0vi0yj5	26PSO43-TO-045	2026-045	2026-01-28 16:00:00	2026-02-16 16:00:00	Social Responsibuility Tree Planting	Claveria, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4nsj01noia40z2zpzn47	2026-06-02 05:38:01.85	2026-06-02 10:07:37.083	February 17, 2026
cmpw7hyyh02siian4b8lpbqs0	26PSO43-TO-046	2026-046	2026-01-28 16:00:00	2026-02-17 16:00:00	Mobile Services (National ID and BRAP)	Salay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4nu301o2ia40z9ybj70d	2026-06-02 05:38:01.913	2026-06-02 10:07:37.139	February 18, 2026
cmpw7hyzn02swian452j49vw4	26PSO43-TO-047	2026-047	2026-01-28 16:00:00	2026-02-18 16:00:00	Barangay Civil Registration System Training	Lugait, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4nvp01oiia40gvifeh6q	2026-06-02 05:38:01.956	2026-06-02 10:07:37.195	February 19, 2026
cmpw7hz0x02tcian4pciu20jn	26PSO43-TO-048	2026-048	2026-01-28 16:00:00	2026-02-24 16:00:00	Mobile Services (National ID and BRAP)	Salay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4nx201owia40cvo2rvig	2026-06-02 05:38:02.001	2026-06-02 10:07:37.246	February 25, 2026
cmpw7hy9002lvian4eurwan5j	26PSO43-TO-019	2026-019	2026-01-15 16:00:00	2026-01-18 16:00:00	Conduct Distribution of Cheque	Tagoloan, Villanueva, and Jasaan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4n2a01h4ia401ytqq7zx	2026-06-02 05:38:00.996	2026-06-02 10:07:36.133	January 19, 2026
cmpw7hyan02m7ian4b9l6n458	26PSO43-TO-021	2026-021	2026-01-15 16:00:00	2026-01-20 16:00:00	Attend Solemnizing Officer Seminar	Carmen, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4n4n01hoia400gs17oyc	2026-06-02 05:38:01.055	2026-06-02 10:07:36.222	January 21, 2026
cmpw7hyc902mjian4kdbwjtxz	26PSO43-TO-022	2026-022	2026-01-15 16:00:00	2026-01-22 16:00:00	Conduct Local Civil Registry Office (LCRO) Evaluation	Naawan, and Initao, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4n5p01hwia40cp0ae83w	2026-06-02 05:38:01.114	2026-06-02 10:07:36.261	January 23, 2026
cmpw7hyda02mrian4ybj1aw17	26PSO43-TO-023	2026-023	2026-01-15 16:00:00	2026-01-20 16:00:00	Conduct Church Visit and Ocular Inspection	El Salvador City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4n6i01i0ia40d79bf5vw	2026-06-02 05:38:01.15	2026-06-02 10:07:36.286	January 21, 2026
cmpw7i09s0385ian48k7ju6pv	26PSO43-TO-104	2026-104	2026-03-08 16:00:00	2026-03-13 16:00:00	To Conduct Philsys and PBRAP Mobile Registraton and Awarding of BRAP Beneficiaries	Lapasan, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4peu0243ia406eau36le	2026-06-02 05:38:03.617	2026-06-02 10:07:39.178	March 14, 2026
cmpw7i0aq038hian4zw531gi2	26PSO43-TO-105	2026-105	2026-03-08 16:00:00	2026-03-15 16:00:00	To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	BJMP Female Dormitory, Lumbia, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4pfg024bia40sbjgr46l	2026-06-02 05:38:03.65	2026-06-02 10:07:39.2	March 16, 2026
cmpw7i072037bian4jmedeuvp	26PSO43-TO-100	2026-100	2026-03-05 16:00:00	2026-03-15 16:00:00	To Conduct Other Crops Field Supervision	Selected Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pbo0231ia4085mux3dw	2026-06-02 05:38:03.519	2026-06-02 10:07:39.066	March 16 - April 11, 2026 (Any 05 Days)
cmpw7i07l037fian4csya39i4	26PSO43-TO-101	2026-101	2026-03-08 16:00:00	2026-03-09 16:00:00	To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	Lugait, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pcc0239ia40q2rl2lhe	2026-06-02 05:38:03.538	2026-06-02 10:07:39.089	March 10, 2026
cmpw7i08b037nian4xvevqe4n	26PSO43-TO-102	2026-102	2026-03-08 16:00:00	2026-03-10 16:00:00	To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	F.S Catanico, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4pd9023jia406u8jzhb2	2026-06-02 05:38:03.563	2026-06-02 10:07:39.123	March 11, 2026
cmpw7i090037xian44q8vxfws	26PSO43-TO-103	2026-103	2026-03-08 16:00:00	2026-03-11 16:00:00	To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	Kalabaylabay, El Salvador City			OUTSIDE_OFFICE	cmpwh4pe0023ria40iyabpzvz	2026-06-02 05:38:03.589	2026-06-02 10:07:39.15	March 12, 2026
cmpw7i0ev039lian4vd1jzx4t	26PSO43-TO-111	2026-111	2026-03-11 16:00:00	2026-03-17 16:00:00	To Conduct "Serbisyo Para Kai Juana in Celebration of the 2026 National Women's Month	Tula, Alubijid, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pko025qia4004kg8d1d	2026-06-02 05:38:03.8	2026-06-02 10:07:39.389	March 18, 2026
cmpw7i0gv03a3ian4ibnaxsws	26PSO43-TO-112	2026-112	2026-03-16 16:00:00	2026-03-24 16:00:00	To Conduct Distribution of Record-Keeping of Harvest from Aquafarms	Manticao to Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4plg025yia40d1bep95v	2026-06-02 05:38:03.871	2026-06-02 10:07:39.417	March 25-26, 2026
cmpw7i0qy03dfian424i4svut	26PSO43-TO-121	2026-121	2026-03-22 16:00:00	2026-03-29 16:00:00	Bi-weekly CPI Collection	Cagyan de Oro City			OUTSIDE_OFFICE	cmpwh4ptn029bia403wukdmd4	2026-06-02 05:38:04.234	2026-06-02 10:07:39.724	March 30-31, April 01,04-06 and April 15-17, 2026
cmpw7i0hv03abian4o9949qgi	26PSO43-TO-113	2026-113	2026-03-16 16:00:00	2026-03-30 16:00:00	To Conduct LOcal Civil Registry Office (LRCO) Evaluation	Kinoguitan and Balingoan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pm70266ia40bzsy302t	2026-06-02 05:38:03.907	2026-06-02 10:07:39.443	March 31, 2026
cmpw7i0iv03ajian4s1wauowv	26PSO43-TO-114	2026-114	2026-03-18 16:00:00	2026-03-20 16:00:00	To Conduct National ID Special Registration	Within Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4pms026eia40wf4lgip1	2026-06-02 05:38:03.943	2026-06-02 10:07:39.463	March 21, 2026
cmpw7i0jf03arian48lanfw5o	26PSO43-TO-115	2026-115	2026-03-18 16:00:00	2026-03-25 16:00:00	To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	Bolisong, El Salvador City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pni026mia4001ls23yo	2026-06-02 05:38:03.964	2026-06-02 10:07:39.491	March 26. 2026
cmpw7i0k803azian4low01vij	26PSO43-TO-116	2026-116	2026-03-18 16:00:00	2026-03-22 16:00:00	To Conduct National ID Mobile Registration	Commission on Audit, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4po0026qia40zil4zsvb	2026-06-02 05:38:03.992	2026-06-02 10:07:39.509	March 23, 2026
cmpw7i0mr03c1ian4vvk35bk2	26PSO43-TO-118	2026-118	2026-03-18 16:00:00	2026-03-22 16:00:00	To Conduct 2026 QSPBI 1st Quarter Distribution of Questionnaires	Selected Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pr7028dia40gw3be9fu	2026-06-02 05:38:04.083	2026-06-02 10:07:39.626	March 23-31, 2026 (Any 02 Days)
cmpw7i0p803cpian446htqfi0	26PSO43-TO-119	2026-119	2026-03-22 16:00:00	2026-03-24 16:00:00	To Attend the 3rd Level Training of Palay and Corn Production Survey	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4ps9028zia40bu7oouha	2026-06-02 05:38:04.172	2026-06-02 10:07:39.663	March 25-26, 2026
cmpw7i0qg03dbian4woakxeae	26PSO43-TO-120	2026-120	2026-03-22 16:00:00	2026-03-31 16:00:00	To Conducrt Field Supervision for Monthly Palay and Corn Monitoring System, Rice and Corn Stocks Survey and Retail Proce Survey	Cagayan de Oro City to Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4psx0293ia40o1kkx51x	2026-06-02 05:38:04.216	2026-06-02 10:07:39.686	April 01-15, 2026 (Any 04 Days)
cmpw7i0rv03dnian4s0vug93r	26PSO43-TO-122	2026-122	2026-03-22 16:00:00	2026-03-31 16:00:00	Weekly CPI Collection for Petroleum and LPG	Gusa, Lapasan, Camaman-an, Carmen and Kauswagan, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4pun029mia40rpjaw7iu	2026-06-02 05:38:04.268	2026-06-02 10:07:39.747	April 01-30, 2026
cmpw7i0so03dvian4jojoupev	26PSO43-TO-123	2026-123	2026-03-22 16:00:00	2026-04-05 16:00:00	To Collect Foreign Trade Documents	Bugo and Macabalan, Cagayan de Oro City and Tagoloan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pv7029sia40cnirileg	2026-06-02 05:38:04.296	2026-06-02 10:07:39.768	April 06, 2026
cmpw7i0tf03e1ian48wafhgcy	26PSO43-TO-124	2026-124	2026-03-24 16:00:00	2026-04-05 16:00:00	Conduct Church Visit and Ocular Inspection	Claveria, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pvo029wia402gbsg5ar	2026-06-02 05:38:04.323	2026-06-02 10:07:39.784	April 06, 2026
cmpw7i0u103e5ian4089jlmgg	26PSO43-TO-125	2026-125	2026-03-25 16:00:00	2026-03-26 16:00:00	Assist LGU for CBMS Pre-DTC Requirement	Balingasag, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pw502a0ia40nm0eqglr	2026-06-02 05:38:04.345	2026-06-02 10:07:39.802	March 27, 2026
cmpw7i0uo03e9ian42wzwzpyg	26PSO43-TO-126	2026-126	2026-03-25 16:00:00	2026-03-29 16:00:00	Attend the Solemnizing Officer Seminar and Conduct National ID information Drive	Camaman-an, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4px902aaia40g6sf5cac	2026-06-02 05:38:04.368	2026-06-02 10:07:39.843	March 30, 2026
cmpw7i0wk03epian454icnzap	26PSO43-TO-128	2026-128	2026-03-25 16:00:00	2026-03-27 16:00:00	Conduct 1st Quarter 2026 Livestock and Poultry Survey: Household (LPS:H) Supervision	Cagayan de Oro City, Alubijid, Claveria, Gingoog City, Initao, Lagonglong, Magsaysay, Manticao, Medina, Ool, and Salay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pyk02amia409zjsdwf0	2026-06-02 05:38:04.436	2026-06-02 10:07:39.89	March 28 - April 10, 2026 (Any 03 Days)
cmpw7i0x703evian41oii8051	26PSO43-TO-129	2026-129	2026-03-25 16:00:00	2026-04-07 16:00:00	Conduct 1st Quarter April 2026 Labor Force Survey (LFS) Field Supervision	Cagayan de Oro City, El Salvador City, Gingoog City, Initao, Jasaan, Lugait, Manticao, Medina, Opol, Salay, Sugbongcogon, Tagoloan, and Villanueva, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pz702asia40fmsdpvsc	2026-06-02 05:38:04.46	2026-06-02 10:07:39.913	April 08-30, 2026 (Any 05 Days)
cmpw7i0y203f1ian4cpul3he0	26PSO43-TO-130	2026-130	2026-03-25 16:00:00	2026-04-06 16:00:00	Conduct Fisheries Survey Supervision	Manticao to Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pzr02awia40mvzeoq5n	2026-06-02 05:38:04.49	2026-06-02 10:07:39.931	April 07-30, 2026 (Any 10 Days)
cmpw7i0c6038xian4wkfykxzz	26PSO43-TO-107	2026-107	2026-03-08 16:00:00	2026-03-10 16:00:00	To Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	Suarez, Kinoguitan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pgw024pia400axsyvav	2026-06-02 05:38:03.703	2026-06-02 10:07:39.254	March 11, 2026
cmpw7i0ym03f5ian4js99ud4m	26PSO43-TO-131	2026-131	2026-03-25 16:00:00	2026-04-05 16:00:00	WPS COLLECTION	Bulua Landing Center, Bulua, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4q0802b0ia40ekc37ytr	2026-06-02 05:38:04.511	2026-06-02 10:07:39.992	April 06, 08, 10, 13, 15, 17, 20, 22, 24, 27, 29, 2026
cmpw7i0yx03f8ian4bc7tkn2w	26PSO43-TO-132	2026-132	2026-03-25 16:00:00	2001-06-30 16:00:00	Conduct 1st Quarter QSPBI Distribution of Questionnaires	Gingoog City to Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4q1u02beia4083s9wgbf	2026-06-02 05:38:04.521	2026-06-02 10:07:40.005	Apirl 07-08, 2026
cmpw7i0zf03fcian48y2jbg5g	26PSO43-TO-133	2026-133	2026-03-25 16:00:00	2026-04-05 16:00:00	Assist LGU for CBMS Pre-DTC Requirement	Claveria, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4q2b02biia402c138h0f	2026-06-02 05:38:04.539	2026-06-02 10:07:40.024	April 06, 2026
cmpw7i27w03qnian43n95w895	26PSO43-TO-190	2026-190	2026-05-20 16:00:00	2026-05-27 16:00:00	Conduct Church Visit and Ocular Inspection	Villanueva, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4r9b02ncia40d44uhk60	2026-06-02 05:38:06.141	2026-06-02 10:07:41.571	May 28, 2026
cmpw7i0cr0393ian4ejm0jpcj	26PSO43-TO-108	2026-108	2026-03-08 16:00:00	2026-03-20 16:00:00	To Conduct Philsys and PBRAP Mobile Registraton and Awarding of BRAP Beneficiaries	Canitoan, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4phq024via407duho4m5	2026-06-02 05:38:03.723	2026-06-02 10:07:39.283	March 21, 2026
cmpw7i0dg0399ian47giqfwpb	26PSO43-TO-109	2026-109	2026-03-09 16:00:00	2026-03-11 16:00:00	To Conducrt Church Visit and Ocular Inspection	Tagpangi, Cagayan de Oro City and Tingalan, Opol, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pib0251ia40o4hwuges	2026-06-02 05:38:03.749	2026-06-02 10:07:39.303	March 12, 2026
cmpw7i0e2039fian496m5lrri	26PSO43-TO-110	2026-110	2026-03-09 16:00:00	2026-03-16 16:00:00	To Conduct 2026 MISSI and PPS Coordination and Distribution of Forms	Different Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4pj00257ia406qpb6vqm	2026-06-02 05:38:03.771	2026-06-02 10:07:39.334	March 17 and 19, 2026
cmpw7i15r03gqian4wei2zfhv	26PSO43-TO-141	2026-141	2026-04-09 16:00:00	2026-04-10 16:00:00	Conduct National ID Special Registration	Cagayan de Oro City, El Salvador City, Tagoloan, and Villanueva, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4q7i02d0ia40pnikg4sj	2026-06-02 05:38:04.767	2026-06-02 10:07:40.211	April 11, 2026
cmpw7i14r03gkian4bsf38jik		2026-140	2026-04-09 16:00:00	2026-04-14 16:00:00	Serve Notice of 2026 MISSI and PPS	Cagayan de Oro City, Tagoloan, and Villanueva, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4q7002csia40m3rq79lp	2026-06-02 05:38:04.732	2026-06-02 10:07:40.192	April 15, 2026
cmpw7i16e03gyian45dq7binn	26PSO43-TO-142	2026-142	2026-04-09 16:00:00	2026-04-12 16:00:00	Conduct 2026 CBMS Data Collection and Verification of the DSWD Social Protection Beneficiaries	Different Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4q8202d4ia40thglsdkp	2026-06-02 05:38:04.79	2026-06-02 10:07:40.229	April 13 - May 22, 2026
cmpw7i16x03h2ian4c3tl7j8v	26PSO43-TO-143	2026-143	2026-04-09 16:00:00	2026-04-22 16:00:00	Conduct Local Civil Registry Office (LCRO) Evaluation	Jasaan, and Villlanueva, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4q8u02dcia400gkznb1e	2026-06-02 05:38:04.809	2026-06-02 10:07:40.26	April 23, 2026
cmpw7i18e03heian4xm52k1x9	26PSO43-TO-145	2026-145	2026-04-09 16:00:00	2026-04-12 16:00:00	Conduct 2026 QSPBI 1st Quarter Collection of Questionnaires	Selected Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4q9u02dkia403yvj51b1	2026-06-02 05:38:04.862	2026-06-02 10:07:40.294	April 13-30, 2026 (Any 02 Days)
cmpw7i18v03hiian455o3uan7	26PSO43-TO-146	2026-146	2026-04-13 16:00:00	2026-04-14 16:00:00	Transport National ID Registration Kits and Conduct Church Visit and Ocular Inspection	Magsaysay and Gingoog City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qar02dyia40wuzgms02	2026-06-02 05:38:04.879	2026-06-02 10:07:40.328	April 15, 2026
cmpw7i19w03hwian45fcr5yqv	26PSO43-TO-147	2026-147	2026-04-13 16:00:00	2026-04-17 16:00:00	Conduct National ID Mobile Registration	Baikingon, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4qbl02e8ia40rlv2az9l	2026-06-02 05:38:04.916	2026-06-02 10:07:40.358	April 18, 2026
cmpw7i1aw03i6ian4x57qeyk4	26PSO43-TO-148	2026-148	2026-04-14 16:00:00	2026-04-15 16:00:00	Conduct BRAP Mobile Registration and Awarding of BRAP Beneficiaries	Sambulawan, El Salvador City			OUTSIDE_OFFICE	cmpwh4qc302ecia4037bj70lc	2026-06-02 05:38:04.952	2026-06-02 10:07:40.376	April 16, 2026
cmpw7i1bg03iaian4f6ng0kh8	26PSO43-TO-149	2026-149	2026-04-19 16:00:00	2026-04-27 16:00:00	Conduct Distribution of QSPBI for PPA, Collection of Building Permits and Certificate of Completion, and CPI Spotchecking	Different Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qd202emia40vgi8twx2	2026-06-02 05:38:04.973	2026-06-02 10:07:40.418	April 28-29 - May 04-07, 2026
cmpw7i1cr03ikian4t9u8z66d	26PSO43-TO-150	2026-150	2026-04-19 16:00:00	2026-04-29 16:00:00	Conduct Local Civil Registry Office (LCRO) Evaluation	Tagoloan and Claveria, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qe302evia40svzj1s57	2026-06-02 05:38:05.019	2026-06-02 10:07:40.448	April 30, 2026
cmpw7i1hl03jwian4l6pl059v	26PSO43-TO-157	2026-157	2026-04-21 16:00:00	2026-04-26 16:00:00	Conduct the 3rd Level Training on 2025 Household Survey on Domestic Visitor (HSDV)	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4qj202g5ia40r6964gs1	2026-06-02 05:38:05.194	2026-06-02 10:07:40.627	April 27 - May 01, 2026
cmpw7i1dr03isian49je2nymr	26PSO43-TO-151	2026-151	2026-04-19 16:00:00	2026-04-21 16:00:00	Pick up and Transport Central Office Personnel and Attend Arraignment and Pre-Trial Conference	Laguindingan Airport, Laguindingan, Misamis Oriental and Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4qez02f3ia401pv1fkhf	2026-06-02 05:38:05.055	2026-06-02 10:07:40.481	April 22-24, 2026
cmpw7i1i003k0ian4jlhiii4z	26PSO43-TO-158	2026-158	2026-04-21 16:00:00	2026-05-03 16:00:00	Conduct the Field Operation on 2025 Household Survey on Domestic Visitor (HSDV)	Selected Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qjj02g9ia4044m1uoee	2026-06-02 05:38:05.209	2026-06-02 10:07:40.643	May 04-26, 2026
cmpw7i1em03j0ian4gbogbmsw	26PSO43-TO-152	2026-152	2026-04-19 16:00:00	2026-04-20 16:00:00	Conduct Distribution and Collection of 2025 Annual Survey of Philippine Business and Indsutry and 2025 Survey of Tourism Esteablishment in the Philippines (STEP)	Selected Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qfg02f7ia40yjrn95k3	2026-06-02 05:38:05.086	2026-06-02 10:07:40.496	April 21, - July 31, 2026
cmpw7i1et03j3ian4yfpk81vy	26PSO43-TO-153	2026-153	2026-04-19 16:00:00	2026-04-26 16:00:00	Conduct Field Supervision of 2025 Annual Survey of Philippine Business and Indsutry and 2025 Survey of Tourism Esteablishment in the Philippines (STEP)	Selected Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qg902ffia40rns69j4r	2026-06-02 05:38:05.093	2026-06-02 10:07:40.527	April 27, - July 31, 2026
cmpw7i1f503jaian4hdt8q4u7	26PSO43-TO-154	2026-154	2026-04-21 16:00:00	2026-04-27 16:00:00	Conduct Church Visit and Ocular Inspection	Gitagum and Alubijid, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qh002flia40kykhb67s	2026-06-02 05:38:05.105	2026-06-02 10:07:40.552	April 28, 2026
cmpw7i1fw03jgian4z4en0a17	26PSO43-TO-155	2026-155	2026-04-21 16:00:00	2026-05-10 16:00:00	Conduct Roll out of Administrative Petition for Correction Automated System (APCAS)	El Salvador City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qi102fxia40fegili8f	2026-06-02 05:38:05.133	2026-06-02 10:07:40.591	May 11-12, 2026
cmpw7i1h303jsian4p4cqppe7	26PSO43-TO-156	2026-156	2026-04-21 16:00:00	2026-04-22 16:00:00	Conduct BRAP Mobile Registration and Awarding of BRAP Beneficiaries	Himaya, El Salvador Ctiy, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qim02g1ia40i1714i6i	2026-06-02 05:38:05.176	2026-06-02 10:07:40.611	April 23, 2026
cmpw7i1ig03k4ian4fccf5uxb	26PSO43-TO-159	2026-159	2026-04-21 16:00:00	2026-05-03 16:00:00	Conduct 2025 Household Survey on Domestic Visitor (HSDV) Field Supervision	Selected Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qkb02gfia405r8cgr5u	2026-06-02 05:38:05.225	2026-06-02 10:07:40.675	May 04-26, 2026 (Any 05 Days)
cmpw7i1j703kaian4dpo8li3d	26PSO43-TO-160	2026-160	2026-04-21 16:00:00	2026-04-24 16:00:00	National ID Special Registration	within Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4qla02gnia40c8nz8krn	2026-06-02 05:38:05.252	2026-06-02 10:07:40.708	April 25, 2026
cmpw7i1jv03kiian45g8zuhyf	26PSO43-TO-161	2026-161	2026-04-26 16:00:00	2026-05-01 16:00:00	Bi-weekly CPI Collection	within Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4qm302gvia40xexwlmkc	2026-06-02 05:38:05.275	2026-06-02 10:07:40.741	May 02-06, 15-17, 2026
cmpw7i10w03fmian4vlzyfhn1	26PSO43-TO-135	2026-135	2026-03-25 16:00:00	2000-12-31 16:00:00	Conduct 2nd Quarter National ID Field Operation	Different Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4q3e02bsia403dia7u38	2026-06-02 05:38:04.592	2026-06-02 10:07:40.062	Apirl 01 - June 30, 2026
cmpw7i12503fwian4jj7azyes	26PSO43-TO-137	2026-137	2026-04-05 16:00:00	2026-04-13 16:00:00	Conduct Local Civil Registry Office (LCRO) Evaluation	Balingasag, and Sugbongcogon, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4q4u02c6ia403fcxzko5	2026-06-02 05:38:04.638	2026-06-02 10:07:40.115	April 14, 2026
cmpw7i13303g4ian4bfl5a769	26PSO43-TO-138	2026-138	2026-04-05 16:00:00	2026-04-06 16:00:00	Conduct Task Force Training on Retail Price Survey for the Generation of Consumer Price Index	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4q5a02caia40lnb2bhcj	2026-06-02 05:38:04.671	2026-06-02 10:07:40.13	April 07-09, 2026
cmpw7i13h03g8ian4s7ey3clx	26PSO43-TO-139	2026-139	2026-04-06 16:00:00	2026-04-07 16:00:00	Conduct Coordination Meeting with DSWD for CBMS and National ID Verification	Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4q6b02cmia40ncexig5e	2026-06-02 05:38:04.685	2026-06-02 10:07:40.169	April 08, 2026
cmpw7i1ol03lkian4egifa29o	26PSO43-TO-167	2026-167	2026-04-29 16:00:00	2026-05-05 16:00:00	Conduct Fisheries Survey Supervision	Manticao to Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qq902huia40nk6y9v57	2026-06-02 05:38:05.446	2026-06-02 10:07:40.886	May 06-31, 2026
cmpw7i1p803loian4rjrgei6n	26PSO43-TO-168	2026-168	2026-04-29 16:00:00	2026-04-30 16:00:00	WPS COLLECTION	Bulua Landing Center, Bulua, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4qqy02hyia40uohfp26r	2026-06-02 05:38:05.468	2026-06-02 10:07:40.972	May 01, 04, 06, 08, 11, 13, 15, 18, 20, 22, 25, 27, 29, 2026
cmpw7i1pg03lrian420oy2ayu	26PSO43-TO-169	2026-169	2026-04-29 16:00:00	2026-05-06 16:00:00	1st Quarter QSPI Collection \nof Questionnaires	Tagoloan, Villanueva, Jasaan, Balingasag, Balingoan, Talisayan, and Gingoog City,  Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qt602ieia40f4xzhj1e	2026-06-02 05:38:05.476	2026-06-02 10:07:40.989	May 07-08, 2026
cmpw7i1q003lvian43a0mu9dk	26PSO43-TO-170	2026-170	2026-04-29 16:00:00	2026-05-03 16:00:00	Attend 3rd Level Training of May \n2026 Labor Force Survey	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4qtl02iiia40zekv5q6h	2026-06-02 05:38:05.497	2026-06-02 10:07:41.004	May 04-05, 2026
cmpw7i1qe03lzian4f7tj5cl6	26PSO43-TO-171	2026-171	2026-04-29 16:00:00	2026-05-03 16:00:00	Conduct 2024 Community-Based Monitoring System (CBMS) Data Turn Over	Opol, El Salvador City, Alubijid,			OUTSIDE_OFFICE	cmpwh4qu602ioia40py8e1ik8	2026-06-02 05:38:05.51	2026-06-02 10:07:41.027	May 04, 2026
cmpw7i1r803m5ian4ld45ihm1	26PSO43-TO-172	2026-172	2026-05-03 16:00:00	2026-05-04 16:00:00	Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	Banglay, Lagonglong, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4quy02iwia40t5p30dpw	2026-06-02 05:38:05.54	2026-06-02 10:07:41.056	May 05, 2026
cmpw7i1s703mdian4o3tvyz1n	26PSO43-TO-173	2026-173	2026-05-04 16:00:00	2026-05-06 16:00:00	Conduct May 2026 Labor Force Survey (LFS) Field Supervision	Medina, Kinoguitan, Jasaan, Alubijid, and Tagoloan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qvx02j4ia40xewytioh	2026-06-02 05:38:05.576	2026-06-02 10:07:41.09	May 07-31, 2026 (Any 02 Days)
cmpw7i1tk03mpian4ue4v4934	26PSO43-TO-175	2026-175	2026-05-06 16:00:00	2026-05-10 16:00:00	Conduct PhilCris Training	Villanueva, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qww02jcia40bhk5mu8o	2026-06-02 05:38:05.624	2026-06-02 10:07:41.125	May 11, 2026
cmpw7i1u603mtian4uxig8hrh	26PSO43-TO-176	2026-176	2026-05-10 16:00:00	2026-05-11 16:00:00	Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board	Lugait, and Manticao, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qxz02joia40c00gm85c	2026-06-02 05:38:05.646	2026-06-02 10:07:41.164	May 12, 2026
cmpw7i1vp03n5ian4lpr2griy	26PSO43-TO-177	2026-177	2026-05-11 16:00:00	2026-05-17 16:00:00	Conduct Coordination and Field Supervision of 2025 Household Survey on Domestic VIsitor (HSDV)	Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qyp02jyia407i36x0yb	2026-06-02 05:38:05.701	2026-06-02 10:07:41.19	May 18, 2026
cmpw7i1wq03nfian4rjbrlr8t	26PSO43-TO-178	2026-178	2026-05-11 16:00:00	2026-05-13 16:00:00	Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board	Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qzh02k6ia408ife8rs1	2026-06-02 05:38:05.738	2026-06-02 10:07:41.218	May 14, 2026
cmpw7i1xp03nnian4ub9vokt1	26PSO43-TO-179	2026-179	2026-05-11 16:00:00	2026-05-12 16:00:00	Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board	Jasaan, and Villlanueva, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4r0902keia40kyn1anez	2026-06-02 05:38:05.773	2026-06-02 10:07:41.247	May 13, 2026
cmpw7i1yl03nvian4700ee9nc	26PSO43-TO-180	2026-180	2026-05-11 16:00:00	2026-05-13 16:00:00	Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board	Opol, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4r1502kmia40ok10lchc	2026-06-02 05:38:05.805	2026-06-02 10:07:41.279	May 14, 2026
cmpw7i1zf03o3ian4cugxl5kq	26PSO43-TO-181	2026-181	2026-05-12 16:00:00	2026-05-13 16:00:00	Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	Ulaliman, El Salvador City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4r2302l0ia40lwcxazyq	2026-06-02 05:38:05.835	2026-06-02 10:07:41.312	May 14, 2026
cmpw7i20i03ohian4qc4dagnl	26PSO43-TO-182	2026-182	2026-05-12 16:00:00	2026-05-13 16:00:00	Conduct Local Civil Registry Office (LCRO) Evaluation	Libertad, Alubijid, Opol, and El Salvador City, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4r3102laia40upo0l73k	2026-06-02 05:38:05.874	2026-06-02 10:07:41.35	May 14 and 19, 2026
cmpw7i21h03orian4dl6q4a3a	26PSO43-TO-183	2026-183	2026-05-13 16:00:00	2026-05-15 16:00:00	To Attend KLAREX nga SERBISYO SA BARYO (KSB) "Kasalan sa Baryo" and To Conduct PhilSys and BRAP Mobile Registration and Awarading of BRAP Beneficiaries	Baikingon, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4r4502lria403wjtuy5y	2026-06-02 05:38:05.91	2026-06-02 10:07:41.385	May 16, 2026
cmpw7i22g03p7ian4ewwotkdt	26PSO43-TO-184	2026-184	2026-05-13 16:00:00	2026-05-17 16:00:00	Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board	Naawan, and Initao, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4r4t02lzia40fyntlfg6	2026-06-02 05:38:05.944	2026-06-02 10:07:41.41	May 18, 2026
cmpw7i23903pfian4krq9md2v	26PSO43-TO-185	2026-185	2026-05-13 16:00:00	2026-05-18 16:00:00	Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board and Transport National ID Registration Kits	Balingasag, Sugbongcogon, Kinoguitan, and Balingoan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4r5x02mfia40mrbi2p6q	2026-06-02 05:38:05.973	2026-06-02 10:07:41.449	May 19, 2026
cmpw7i24l03pvian4fk7d137d	26PSO43-TO-186	2026-186	2026-05-13 16:00:00	2026-05-19 16:00:00	Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board	Libertad, and Gitagum, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4r6o02mnia40u1dmdbgj	2026-06-02 05:38:06.021	2026-06-02 10:07:41.477	May 20, 2026
cmpw7i25k03q3ian4a1mupl40	26PSO43-TO-187	2026-187	2026-05-13 16:00:00	2026-05-14 16:00:00	Conduct Supervision on National ID Operation	National ID Fixed Registration Center, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4r7702mria40hpp4y6kb	2026-06-02 05:38:06.056	2026-06-02 10:07:41.501	May 15 and 22, 2026
cmpw7i26603q7ian4tzdg5src	26PSO43-TO-188	2026-188	2026-05-18 16:00:00	2026-05-19 16:00:00	Conduct City Civil Registry Office (CCRO) Evaluation	Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4r8402myia40jfdizyql	2026-06-02 05:38:06.079	2026-06-02 10:07:41.529	May 20, 2026
cmpw7i27003qdian4e0twif1f	26PSO43-TO-189	2026-189	2026-05-19 16:00:00	2026-05-20 16:00:00	Conduct BRAP and National ID Mobile Registration and Implementation of BRAP	Quibonbon, El Salvador City			OUTSIDE_OFFICE	cmpwh4r8u02n8ia408x5y52l2	2026-06-02 05:38:06.109	2026-06-02 10:07:41.553	May 21, 2026
cmpw7i1kr03kqian42m3bhzl9	26PSO43-TO-162	2026-162	2026-04-26 16:00:00	2026-04-30 16:00:00	Weekly CPI Collection for Petroleum and LPG	Gusa, Lapasan, Camaman-an, Carmen and Kauswagan, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4qn102h4ia40au175hp1	2026-06-02 05:38:05.307	2026-06-02 10:07:40.77	May 01-31, 2026
cmpw7i1ln03kyian4hyi36zv7	26PSO43-TO-163	2026-163	2026-04-26 16:00:00	2026-05-05 16:00:00	Collect Foreign Trade Documents	Bugo and Macabalan, Cagayan de Oro City and Tagoloan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qno02haia40qo30royj	2026-06-02 05:38:05.34	2026-06-02 10:07:40.795	May 06, 2026
cmpw7i1n203l8ian4yq8cdqgb	26PSO43-TO-165	2026-165	2026-04-27 16:00:00	2026-04-29 16:00:00	Conduct BRAP Mobile Registration and Awarding of BRAP Beneficiaries	Lumbo, Lagonglong, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qot02hiia40988jxkhx	2026-06-02 05:38:05.39	2026-06-02 10:07:40.834	April 30, 2026
cmpw7i1nn03lcian4cezhanlc	26PSO43-TO-166	2026-166	2026-04-29 16:00:00	2026-05-04 16:00:00	Conduct 2025 Household Survey on Domestic Visitor (HSDV) Field Supervision with Central Office Personnel	Cagayan de Oro City to Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4qpn02hqia40k6yxb6rb	2026-06-02 05:38:05.412	2026-06-02 10:07:40.865	May 05-06, 2026
cmpw7i2gc03spian4274f341t	26PSO43-TO-201	2026-201	2026-05-27 16:00:00	2026-05-31 16:00:00	Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board	Salay, and Medina, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4rh402pjia4094f720u8	2026-06-02 05:38:06.444	2026-06-02 10:07:41.853	June 01-02, 2026
cmpw7i2iu03t9ian4qx3az7lo	26PSO43-TO-204	2026-204	2026-05-28 16:00:00	2026-06-07 16:00:00	Attend 3rd Level Training of 2nd Quarter 2026 Crops Production Survey	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4rit02pzia40ki2j9k28	2026-06-02 05:38:06.534	2026-06-02 10:07:41.913	June 08-09, 2026
cmpw7i28z03qvian4e94g5i49	26PSO43-TO-192	2026-192	2026-05-20 16:00:00	2026-05-24 16:00:00	Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board	Talisayan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4ral02noia40rd8oy0w2	2026-06-02 05:38:06.18	2026-06-02 10:07:41.618	May 25, 2026
cmpw7i2ek03s7ian4bo88n50n	26PSO43-TO-199	2026-199	2026-05-24 16:00:00	2026-05-27 16:00:00	Conduct a 5 Mminute Talk During the National ID Mobile Registration with Clients to Discuss the Importance of the National ID in Paper and Digital Form and How it Will Help Filipino Access Their Basic Needs and Conduct BRAP and National ID Mobile Registration	Casinglot, Tagoloan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4rfv02p7ia4000hl1b1g	2026-06-02 05:38:06.38	2026-06-02 10:07:41.808	May 28, 2026
cmpw7i2fx03slian4dk5nle20	26PSO43-TO-200	2026-200	2026-05-27 16:00:00	2026-05-28 16:00:00	Conduct a 5 Mminute Talk During the National ID Mobile Registration with Clients to Discuss the Importance of the National ID in Paper and Digital Form and How it Will Help Filipino Access Their Basic Needs and Transport National ID Registration Kits	Tagoloan, and Alubijid, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4rgb02pbia40apgyvzr6	2026-06-02 05:38:06.429	2026-06-02 10:07:41.822	May 29, 2026
cmpw7i2ks03tpian4je56mi8u	26PSO43-TO-208	2026-208	2026-05-28 16:00:00	2026-05-29 16:00:00	Attend KLAREX nga SERBISYO SA BARYO (KSB) "KASALAN NG BAYAN" to Conduct  BRAP Mobile Registration and Awarding of BRAP Beneficiaries	Puntod, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4rla02qpia40e74z9ob0	2026-06-02 05:38:06.605	2026-06-02 10:07:42.002	May 30, 2026
cmpw7i2ch03rpian4n31k5sz7	26PSO43-TO-196	2026-196	2026-05-24 16:00:00	2026-05-31 16:00:00	Weekly CPI Collection for \nPetroleum and LPG	Gusa, Lapasan, Camaman-an, Carmen and Kauswagan, Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4rdn02ojia40ct0aav17	2026-06-02 05:38:06.305	2026-06-02 10:07:41.728	June 01-30, 2026
cmpw7i2an03rbian4ojj7qu2y	26PSO43-TO-194	2026-194	2026-05-20 16:00:00	2026-05-27 16:00:00	Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board	Claveria, and Tagoloan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4rc002o2ia408ha0dk6h	2026-06-02 05:38:06.239	2026-06-02 10:07:41.669	May 28, 2026
cmpw7i2k703tlian4wgl1oniz	26PSO43-TO-207	2026-207	2026-05-28 16:00:00	2026-05-31 16:00:00	Conduct Field Supervision for \nMonthly Palay and Corn Monitoring \nSystem, Rice and Corn Stocks \nSurvey	Cagayan de Oro City to Magsaysay, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4rke02qbia40k9l9bsm7	2026-06-02 05:38:06.584	2026-06-02 10:07:41.971	June 01-15, 2026 (Any 04 Days)
cmpw7i28f03qrian4v8k0y0xl	26PSO43-TO-191	2026-191	2026-05-20 16:00:00	2026-05-21 16:00:00	Conduct National ID Field Supervision	Villanueva, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4r9t02ngia40t5tal3kc	2026-06-02 05:38:06.159	2026-06-02 10:07:41.589	May 22, 2026
cmpw7i2jc03tdian4zwbuyd5t	26PSO43-TO-205	2026-205	2026-05-28 16:00:00	2026-06-16 16:00:00	Conduct Field Operation on 2nd Quarter 2026 Crops Production Survey	Selected Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4rjg02q3ia406rpaf473	2026-06-02 05:38:06.552	2026-06-02 10:07:41.936	June 17-30, 2026
cmpw7i29s03r3ian4kmlmibxc	26PSO43-TO-193	2026-193	2026-05-20 16:00:00	2026-05-25 16:00:00	Conduct Convening of Municipal Community-Based Monitoring System (CBMS) Coordinating Board	El Salvador City, and Laguindingan, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4rba02nwia400qijj4ak	2026-06-02 05:38:06.208	2026-06-02 10:07:41.644	May 26, 2026
cmpw7i2ic03t5ian4hjno6inz	26PSO43-TO-203	2026-203	2026-05-28 16:00:00	2026-06-02 16:00:00	Attend Kasalan ng Bayan and Conduct BRAP and National ID Mobile Registration	Gitagum, Misamis Oriental			OUTSIDE_OFFICE	cmpwh4rif02pvia40y7putfiq	2026-06-02 05:38:06.516	2026-06-02 10:07:41.898	June 03, 2026
cmpw7i2e603s3ian4lmyptbmz	26PSO43-TO-198	2026-198	2026-05-24 16:00:00	2026-06-03 16:00:00	Attend 3rd Level Training of June 2026 Labor Force Survey (LFS)	PSA Misamis Oriental Training Room, Cagayan de Oro City			OFFICE	cmpwh4ret02otia40b5a8i0np	2026-06-02 05:38:06.366	2026-06-02 10:07:41.768	June 04-05, 2026
cmpw7i2he03sxian4mqekmt7m	26PSO43-TO-202	2026-202	2026-05-28 16:00:00	2026-05-31 16:00:00	Conduct Collection of QSPBI for Provincial Product Accoun(PPA) and Follow-up on the Provincial Product Account (PPA)	Different Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4rhx02pria40sj75n76z	2026-06-02 05:38:06.482	2026-06-02 10:07:41.883	June 01-04, 2026
cmpw7i2dd03rxian4rp032bws	26PSO43-TO-197	2026-197	2026-05-24 16:00:00	2026-06-02 16:00:00	Collect Foreign Trade Documents	Bugo, Macabalan, Cagayan de Oro City, Tagoloan			OUTSIDE_OFFICE	cmpwh4reb02opia40buxwnsmd	2026-06-02 05:38:06.337	2026-06-02 10:07:41.752	June 03-05, 2026 (Any 01 Day)
cmpw7i2lt03u3ian44zx1bv02	26PSO43-TO-209	2026-209	2026-05-28 16:00:00	2026-06-16 16:00:00	Conduct Other Crops Field Supervision	Selected Cities and Municipalities of Misamis Oriental			OUTSIDE_OFFICE	cmpwh4rlv02qtia40ac1gd1ye	2026-06-02 05:38:06.642	2026-06-02 10:07:42.024	June 17 - July 11, 2026 (Any 05 Days)
cmpw7i2bi03rhian4pyp06vfk	26PSO43-TO-195	2026-195	2026-05-24 16:00:00	2026-05-31 16:00:00	Bi-weekly CPI Collection	within Cagayan de Oro City			OUTSIDE_OFFICE	cmpwh4rcq02oaia4060b4rmr9	2026-06-02 05:38:06.27	2026-06-02 10:07:41.7	June 01-05, 15-17, 2026
\.


--
-- Data for Name: SpecialOrderPerson; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SpecialOrderPerson" (id, "specialOrderId", "originalName", "normalizedName", "personnelId", "matchStatus", "customLabel", "isTravelTagged") FROM stdin;
cmpwh4mkq01diia40shyee9uu	cmpw7hxs302ibian4gxfopccw	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4mlw01dmia40dzgnz7b3	cmpw7hxt202ifian4p0kmihlx	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4mm301doia40duq0dczt	cmpw7hxt202ifian4p0kmihlx	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4mm901dqia40hj9w2xcw	cmpw7hxt202ifian4p0kmihlx	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4mn701duia400j2s0cso	cmpw7hxu702inian4fm0zli6l	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4mnf01dwia40fpndae2d	cmpw7hxu702inian4fm0zli6l	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4mnm01dyia406luivr41	cmpw7hxu702inian4fm0zli6l	CINDY B DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4mnt01e0ia4095udyrw5	cmpw7hxu702inian4fm0zli6l	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4mos01e4ia40yc5skkln	cmpw7hxvt02ixian4wijgc7aa	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4mpj01e8ia406gx8ycyi	cmpw7hxwk02j1ian489171d8t	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4mpr01eaia407wvzmoi3	cmpw7hxwk02j1ian489171d8t	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4mpz01ecia40w2yv3oc8	cmpw7hxwk02j1ian489171d8t	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4mqp01egia40bjcqewmh	cmpw7hxxl02j9ian49qilwhn5	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4mre01ekia40qs2hmg09	cmpw7hxy902jdian4kr88ilye	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4ms101eoia40hvck8sii	cmpw7hxyx02jhian46dlm6rnq	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4ms601eqia40df76jxhe	cmpw7hxyx02jhian46dlm6rnq	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4msx01euia40ycp2oqcv	cmpw7hxzt02jnian46wjfytoe	ADAMS CHRISTOPHER P. SIO-E	adams christopher p sioe	\N	UNMATCHED	\N	f
cmpwh4mt001ewia40189pl014	cmpw7hxzt02jnian46wjfytoe	VEVIEN P. BACULIO	vevien p baculio	cmpm9wtav0040iaus5stdmg52	MATCHED	\N	t
cmpwh4mtm01f0ia406qzxszjd	cmpw7hy0l02jtian4f7419x9f	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4mts01f2ia40eji7vhn5	cmpw7hy0l02jtian4f7419x9f	MARLON T. GALINDO	marlon t galindo	cmpm7s7j8003liauswjjxk8ex	MATCHED	\N	t
cmpwh4mtz01f4ia409gnlglt6	cmpw7hy0l02jtian4f7419x9f	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4mu501f6ia401d4ig0la	cmpw7hy0l02jtian4f7419x9f	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4mv301fbia40ci5mfh1y	cmpw7hy1z02k3ian4vj32hcj7	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4mvw01ffia405tym0ims	cmpw7hy2p02k7ian4yqu0w6tc	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4mw201fhia40qn26vclb	cmpw7hy2p02k7ian4yqu0w6tc	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4mw801fjia400s1p9hkb	cmpw7hy2p02k7ian4yqu0w6tc	GRAD LUCKY MARK N. ARCEGA	grad lucky mark n arcega	cmpm4p7n6001qiausf4s5ahht	MATCHED	\N	t
cmpwh4mwf01flia40jfhns4pv	cmpw7hy2p02k7ian4yqu0w6tc	CINDY B DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4mwl01fnia40p2jc6pyu	cmpw7hy2p02k7ian4yqu0w6tc	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4mxc01fria4021t1q0z9	cmpw7hy4802kjian46262anyr	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	f
cmpwh4mxe01ftia40bmdg35kl	cmpw7hy4802kjian46262anyr	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	f
cmpwh4mxi01fvia40nfu7g0n1	cmpw7hy4802kjian46262anyr	VEVIEN P. BACULIO	vevien p baculio	cmpm9wtav0040iaus5stdmg52	MATCHED	\N	f
cmpwh4mxl01fxia407shikx07	cmpw7hy4802kjian46262anyr	GRACE JESSICA G. MANGCO	grace jessica g mangco	\N	UNMATCHED	\N	f
cmpwh4mxo01fzia40dsxurru5	cmpw7hy4802kjian46262anyr	LYN S. SANTOS	lyn s santos	\N	UNMATCHED	\N	f
cmpwh4mxr01g1ia402rghqfpi	cmpw7hy4802kjian46262anyr	MARITES N. GOMEZ	marites n gomez	\N	UNMATCHED	\N	f
cmpwh4myc01g5ia406vylfb7o	cmpw7hy5602kxian4633arzps	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4myk01g7ia401didln8f	cmpw7hy5602kxian4633arzps	GRAD LUCKY MARK N. ARCEGA	grad lucky mark n arcega	cmpm4p7n6001qiausf4s5ahht	MATCHED	\N	t
cmpwh4mza01gbia40muk1joxn	cmpw7hy6002l3ian4927s3k97	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4mzv01gfia40ls994rpq	cmpw7hy6m02l7ian435icb3k6	MARCELO E. TOLEDO	marcelo e toledo	\N	UNMATCHED	\N	f
cmpwh4mzy01ghia40c3tfsd9r	cmpw7hy6m02l7ian435icb3k6	SHEILA MARIE BAHIAN	sheila marie bahian	\N	UNMATCHED	\N	f
cmpwh4n0001gjia408nc7u2j0	cmpw7hy6m02l7ian435icb3k6	ERIKA MAY TAGAM	erika may tagam	\N	UNMATCHED	\N	f
cmpwh4n0301glia40gx9l1wyf	cmpw7hy6m02l7ian435icb3k6	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4n0q01gpia40ivj65px3	cmpw7hy7n02lhian42nd04i76	MARJUN C. PABAYO	marjun c pabayo	\N	UNMATCHED	\N	f
cmpwh4n0s01gria40snzd7igu	cmpw7hy7n02lhian42nd04i76	MARK RAYMUND T. DEGALA	mark raymund t degala	\N	UNMATCHED	\N	f
cmpwh4n0v01gtia40byxkvxe5	cmpw7hy7n02lhian42nd04i76	JOEVIE PALANJAY	joevie palanjay	\N	UNMATCHED	\N	f
cmpwh4n0y01gvia40e81mlqe1	cmpw7hy7n02lhian42nd04i76	RHONA AMOR EIGO	rhona amor eigo	\N	UNMATCHED	\N	f
cmpwh4n1f01gzia40xtm0hgh1	cmpw7hy8e02lrian4j9ka88zf	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4n2501h3ia40ufw8zyuv	cmpw7hy9002lvian4eurwan5j	JOHN MICHAEL C. OPPUS	john michael c oppus	\N	UNMATCHED	\N	f
cmpwh4n2o01h7ia40bqfvzkhc	cmpw7hy9g02lzian41esx4eol	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4n2t01h9ia40d7rtoxho	cmpw7hy9g02lzian41esx4eol	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4n3001hbia40lgb3qctm	cmpw7hy9g02lzian41esx4eol	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4n3n01hfia40jl8rh61w	cmpw7hyan02m7ian4b9l6n458	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4pry028sia40xzd1uds4	cmpw7i0p803cpian446htqfi0	LORETA ANTONIO	loreta antonio	\N	UNMATCHED	\N	f
cmpwh4ps0028uia40zjubadzv	cmpw7i0p803cpian446htqfi0	MERLYNDA BORRES	merlynda borres	\N	UNMATCHED	\N	f
cmpwh4ps2028wia404ldnk9mz	cmpw7i0p803cpian446htqfi0	ALQUIN BAA	alquin baa	\N	UNMATCHED	\N	f
cmpwh4ps4028yia40md8zvqqt	cmpw7i0p803cpian446htqfi0	ARMANDO MATULAC	armando matulac	\N	UNMATCHED	\N	f
cmpwh4psq0292ia404tqog61u	cmpw7i0qg03dbian4woakxeae	LEE CHARGE S. CAILING	lee charge s cailing	cmpm70pwb002yiaus2m2fx6w0	MATCHED	\N	t
cmpwh4pt80296ia40tfw3ksxa	cmpw7i0qy03dfian424i4svut	SHEILA P. DE GALA	sheila p de gala	\N	UNMATCHED	\N	f
cmpwh4pta0298ia4079k1sklf	cmpw7i0qy03dfian424i4svut	ANGEL MARIE C. GUILLENA	angel marie c guillena	cmpmcmiud0058iaustuwfw2sp	MATCHED	\N	t
cmpwh4ptf029aia40xnl80w94	cmpw7i0qy03dfian424i4svut	RODELYN E. NAVAROSA	rodelyn e navarosa	cmpmcsydy005biaus8mz8wrn4	MATCHED	\N	t
cmpwh4n3t01hhia40mxnvy65g	cmpw7hyan02m7ian4b9l6n458	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4n4001hjia40wybexx7v	cmpw7hyan02m7ian4b9l6n458	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4n4601hlia403u43e9t2	cmpw7hyan02m7ian4b9l6n458	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4n4d01hnia40ig9v66kz	cmpw7hyan02m7ian4b9l6n458	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4n5501hria4091eivefv	cmpw7hyc902mjian4kdbwjtxz	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4n5c01htia40zrccfwqv	cmpw7hyc902mjian4kdbwjtxz	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4n5h01hvia40mup9jsnu	cmpw7hyc902mjian4kdbwjtxz	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4n6801hzia404vczg68d	cmpw7hyda02mrian4ybj1aw17	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4n6w01i3ia403pm4uv5b	cmpw7hydt02mvian4fhq1ek38	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4n7201i5ia40hx7i27qa	cmpw7hydt02mvian4fhq1ek38	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4n7801i7ia40pe6c0i12	cmpw7hydt02mvian4fhq1ek38	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4n7x01ibia40jq4emoau	cmpw7hyer02n3ian41648drrz	MARCELO E. TOLEDO	marcelo e toledo	\N	UNMATCHED	\N	f
cmpwh4n7z01idia404ou3p4jm	cmpw7hyer02n3ian41648drrz	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4n8p01ihia40vi2e4379	cmpw7hyfg02n9ian4j5lefgrh	MILAN L. GUTAY	milan l gutay	cmpm7q17h003fiausimucssfj	MATCHED	\N	t
cmpwh4n8s01ijia40gv71gfeu	cmpw7hyfg02n9ian4j5lefgrh	PAULA P. DEDUMO	paula p dedumo	cmpmcwkjj005niausxhpwr0rq	MATCHED	\N	t
cmpwh4n8v01ilia40l3l3c8yq	cmpw7hyfg02n9ian4j5lefgrh	QUEENIE MARIE B. CASIÑO	queenie marie b casio	cmpmctto9005eiaus7jv5w8sw	MATCHED	\N	t
cmpwh4n8x01inia407gepi0ax	cmpw7hyfg02n9ian4j5lefgrh	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4n9701iqia40iqwsa8p0	cmpw7hyfz02niian49smlxnkm	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4n9d01isia401eiglimy	cmpw7hyfz02niian49smlxnkm	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4na001iwia40fsjy45br	cmpw7hygu02noian4lgl9p5al	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4nao01j0ia40yckbvq8v	cmpw7hyhe02nsian4bmiqtb43	MARCELO B. TOLEDO JR.                                                                                     WED MICOLE B. QUILANG	marcelo b toledo jr wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4nbf01j4ia40y7dvbf8h	cmpw7hyi002nwian433hcehl4	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4nc701j8ia40sdd8c8fk	cmpw7hyip02o0ian47jztef6j	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4ncq01jcia402yc5vzvv	cmpw7hyj502o4ian4ikwukhdj	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4ncx01jeia40j5i8ubvt	cmpw7hyj502o4ian4ikwukhdj	CLARISSA L. NICO	clarissa l nico	cmpmcyll0005tiaus9udmpd06	MATCHED	\N	t
cmpwh4nd301jgia40sdntzy9n	cmpw7hyj502o4ian4ikwukhdj	JONESIO B. SENAJON	jonesio b senajon	\N	UNMATCHED	\N	f
cmpwh4nd501jiia40up7b3imx	cmpw7hyj502o4ian4ikwukhdj	KATHYRINE S. QUE-E	kathyrine s quee	\N	UNMATCHED	\N	f
cmpwh4nd801jkia404ebjwv42	cmpw7hyj502o4ian4ikwukhdj	MARGIE D. SANCHEZ	margie d sanchez	\N	UNMATCHED	\N	f
cmpwh4ndb01jmia40ojwi64kd	cmpw7hyj502o4ian4ikwukhdj	CORA B. RAPIRAP	cora b rapirap	\N	UNMATCHED	\N	f
cmpwh4ndd01joia40esqsy08t	cmpw7hyj502o4ian4ikwukhdj	ZYRRA VICIO	zyrra vicio	\N	UNMATCHED	\N	f
cmpwh4ndg01jqia40qjg68ps5	cmpw7hyj502o4ian4ikwukhdj	MARITES N. GOMEZ	marites n gomez	\N	UNMATCHED	\N	f
cmpwh4ndj01jsia40sxs0dht6	cmpw7hyj502o4ian4ikwukhdj	MARY ANN REMOLE	mary ann remole	\N	UNMATCHED	\N	f
cmpwh4ne501jwia40daes0uwd	cmpw7hykh02ooian4fkd1jal0	SHEILA P. DE GALA	sheila p de gala	\N	UNMATCHED	\N	f
cmpwh4ne801jyia40rbt999t6	cmpw7hykh02ooian4fkd1jal0	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4nex01k2ia40cg0kv6c1	cmpw7hyl002ouian46f95otlm	SHEILA P. DE GALA	sheila p de gala	\N	UNMATCHED	\N	f
cmpwh4nf101k4ia40jvkhm9nd	cmpw7hyl002ouian46f95otlm	ANGEL MARIE C. GUILLENA	angel marie c guillena	cmpmcmiud0058iaustuwfw2sp	MATCHED	\N	t
cmpwh4nf901k6ia40rs7tg7lc	cmpw7hyl002ouian46f95otlm	RODELYN E. NAVAROSA	rodelyn e navarosa	cmpmcsydy005biaus8mz8wrn4	MATCHED	\N	t
cmpwh4ng101kbia40xkdgf72o	cmpw7hylz02p2ian4yv3xyofc	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4ng801kdia401u3a6s62	cmpw7hylz02p2ian4yv3xyofc	SHEILA P. DE GALA	sheila p de gala	\N	UNMATCHED	\N	f
cmpwh4ngs01khia40460xpn07	cmpw7hymo02p8ian4nf17i4ug	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4ngy01kjia401b2apanj	cmpw7hymo02p8ian4nf17i4ug	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4nhf01knia40anq6l6im	cmpw7hync02peian4tqx1muru	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4nhl01kpia40obeykfbd	cmpw7hync02peian4tqx1muru	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4nhr01kria40ch312nfr	cmpw7hync02peian4tqx1muru	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4nhy01ktia40bzaid8qs	cmpw7hync02peian4tqx1muru	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4ni401kvia40ik96ynwb	cmpw7hync02peian4tqx1muru	SHIELA MAY D. REGULAR	shiela may d regular	\N	UNMATCHED	\N	f
cmpwh4ni601kxia40l9za0wv6	cmpw7hync02peian4tqx1muru	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4niy01l1ia4071afewxz	cmpw7hyot02psian4zc94n9c9	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4nj501l3ia40s6hkesfu	cmpw7hyot02psian4zc94n9c9	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4nj901l5ia40vhyjgk4b	cmpw7hyot02psian4zc94n9c9	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4njx01l9ia406nlo1l9s	cmpw7hypm02q0ian4hyxsayx8	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4nkl01ldia40p4rji12c	cmpw7hyq602q4ian4rjlt92h0	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4nkr01lfia40pzk6puei	cmpw7hyq602q4ian4rjlt92h0	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4nkx01lhia40yz08fl8h	cmpw7hyq602q4ian4rjlt92h0	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4nl401ljia40lwvmqjou	cmpw7hyq602q4ian4rjlt92h0	MARK RAYMUND DEGALA	mark raymund degala	\N	UNMATCHED	\N	f
cmpwh4nl701llia40nvw2ofu5	cmpw7hyq602q4ian4rjlt92h0	CHRISTIAN JEN LABADO	christian jen labado	\N	UNMATCHED	\N	f
cmpwh4nls01lpia4061wk5pue	cmpw7hyre02qgian4sl2f0y85	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4nly01lria40h3v1q2jk	cmpw7hyre02qgian4sl2f0y85	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4nm401ltia404q8zztr1	cmpw7hyre02qgian4sl2f0y85	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4nmb01lvia4092wrvq10	cmpw7hyre02qgian4sl2f0y85	CHRISTIAN JEN LABADO	christian jen labado	\N	UNMATCHED	\N	f
cmpwh4nmd01lxia408ojtjupc	cmpw7hyre02qgian4sl2f0y85	JOED D. ESTRELLA	joed d estrella	\N	UNMATCHED	\N	f
cmpwh4nmg01lzia40s4wyfiwt	cmpw7hyre02qgian4sl2f0y85	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4nmn01m1ia40tgtrj29u	cmpw7hyre02qgian4sl2f0y85	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4nna01m5ia4031x6eoaq	cmpw7hysz02qwian4cyv2rt7w	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4nng01m7ia40h9o34825	cmpw7hysz02qwian4cyv2rt7w	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4nnk01m9ia40gspkvn7z	cmpw7hysz02qwian4cyv2rt7w	HECTORB. PAYLANGCO	hectorb paylangco	\N	UNMATCHED	\N	f
cmpwh4no201mdia40n0ickcpa	cmpw7hytx02r4ian4qd5r02kw	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4no701mfia40ijlqpp0s	cmpw7hytx02r4ian4qd5r02kw	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4nof01mhia40hi3158r9	cmpw7hytx02r4ian4qd5r02kw	MARK RAYMUND DEGALA	mark raymund degala	\N	UNMATCHED	\N	f
cmpwh4noh01mjia40s4eh7hnc	cmpw7hytx02r4ian4qd5r02kw	CHRISTIAN JEN LABADO	christian jen labado	\N	UNMATCHED	\N	f
cmpwh4np401mnia409iijwdru	cmpw7hyuu02reian4z5h0u2mh	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4npa01mpia4070rqavyr	cmpw7hyuu02reian4z5h0u2mh	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4npg01mria40aj78crtc	cmpw7hyuu02reian4z5h0u2mh	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4nq501mvia4065qbntuy	cmpw7hyvw02rmian4b9za0p4w	CHERRY MAE C. PARAJIS	cherry mae c parajis	\N	UNMATCHED	\N	f
cmpwh4nq801mxia40j17d1uny	cmpw7hyvw02rmian4b9za0p4w	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4nqf01mzia40b3l4wsm5	cmpw7hyvw02rmian4b9za0p4w	JOSELINO UDAL	joselino udal	\N	UNMATCHED	\N	f
cmpwh4nr001n3ia403b1gth8v	cmpw7hywq02ruian4x0vi0yj5	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4nr701n5ia40qmzvyaij	cmpw7hywq02ruian4x0vi0yj5	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4nrf01n7ia40995mxizw	cmpw7hywq02ruian4x0vi0yj5	WED MICOLE QUILANG	wed micole quilang	\N	UNMATCHED	\N	f
cmpwh4nrj01n9ia40mg3eeby9	cmpw7hywq02ruian4x0vi0yj5	MARLON GALINDO	marlon galindo	\N	UNMATCHED	\N	f
cmpwh4nrm01nbia408bvkz2so	cmpw7hywq02ruian4x0vi0yj5	CHRISTIAN JEN LABADO	christian jen labado	\N	UNMATCHED	\N	f
cmpwh4nrp01ndia40odf0ixi9	cmpw7hywq02ruian4x0vi0yj5	JOED D. ESTRELLA	joed d estrella	\N	UNMATCHED	\N	f
cmpwh4nrt01nfia40sa8j6q4r	cmpw7hywq02ruian4x0vi0yj5	GRAD LUCKY MARK ARCEGA	grad lucky mark arcega	\N	UNMATCHED	\N	f
cmpwh4nrw01nhia40d96t4ujr	cmpw7hywq02ruian4x0vi0yj5	ANGEL MARIE GUILLENA	angel marie guillena	\N	UNMATCHED	\N	f
cmpwh4nrz01njia4081j4z0ib	cmpw7hywq02ruian4x0vi0yj5	CHRISTIAN BRYAN ABRAGAN	christian bryan abragan	\N	UNMATCHED	\N	f
cmpwh4ns101nlia40ghgw5kcg	cmpw7hywq02ruian4x0vi0yj5	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4ns801nnia407faenmbs	cmpw7hywq02ruian4x0vi0yj5	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4nt001nria4013811a8v	cmpw7hyyh02siian4b8lpbqs0	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4nt701ntia40vbaj4m2u	cmpw7hyyh02siian4b8lpbqs0	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4nte01nvia4070h111yz	cmpw7hyyh02siian4b8lpbqs0	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4ntk01nxia40j66dj9m2	cmpw7hyyh02siian4b8lpbqs0	MARK RAYMUND DEGALA	mark raymund degala	\N	UNMATCHED	\N	f
cmpwh4ntn01nzia40gyk2pe9n	cmpw7hyyh02siian4b8lpbqs0	CHRISTIAN JEN LABADO	christian jen labado	\N	UNMATCHED	\N	f
cmpwh4ntr01o1ia40kbzwgcvf	cmpw7hyyh02siian4b8lpbqs0	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4nul01o5ia40knl5njth	cmpw7hyzn02swian452j49vw4	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4nuq01o7ia40fqukxbqu	cmpw7hyzn02swian452j49vw4	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4nuw01o9ia403bpfvh2k	cmpw7hyzn02swian452j49vw4	WED MICOLE QUILANG	wed micole quilang	\N	UNMATCHED	\N	f
cmpwh4nv001obia409ai0s1ea	cmpw7hyzn02swian452j49vw4	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4nv501odia404s00ku7r	cmpw7hyzn02swian452j49vw4	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4nvb01ofia40jqrv0yk9	cmpw7hyzn02swian452j49vw4	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4nvi01ohia40trok2gj8	cmpw7hyzn02swian452j49vw4	CHRISTIAN JEN LABADO	christian jen labado	\N	UNMATCHED	\N	f
cmpwh4nw401olia40wfta98ht	cmpw7hz0x02tcian4pciu20jn	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4nwa01onia40t8txh0mm	cmpw7hz0x02tcian4pciu20jn	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4nwi01opia40bamx5ldh	cmpw7hz0x02tcian4pciu20jn	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4nwn01oria401dwakspf	cmpw7hz0x02tcian4pciu20jn	MARK RAYMUND DEGALA	mark raymund degala	\N	UNMATCHED	\N	f
cmpwh4nwr01otia40945trvoc	cmpw7hz0x02tcian4pciu20jn	CHRISTIAN JEN LABADO	christian jen labado	\N	UNMATCHED	\N	f
cmpwh4nwu01ovia4055lrie91	cmpw7hz0x02tcian4pciu20jn	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4nxp01ozia40py9vftb5	cmpw9vzij044aian4maydtzw6	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4nxv01p1ia40d0s0j9av	cmpw9vzij044aian4maydtzw6	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4ny201p3ia4016r0zwc9	cmpw9vzij044aian4maydtzw6	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4ny801p5ia40gun4fb5i	cmpw9vzij044aian4maydtzw6	CHRISTIAN JEN LABADO	christian jen labado	\N	UNMATCHED	\N	f
cmpwh4nyb01p7ia408km4l2c6	cmpw9vzij044aian4maydtzw6	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4nyh01p9ia40j3c4371q	cmpw9vzij044aian4maydtzw6	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4nz601pdia40qewwhzzq	cmpw9vzka044oian4jr17t1f0	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4nzb01pfia406xpe7feh	cmpw9vzka044oian4jr17t1f0	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4nzj01phia40p09bnzl8	cmpw9vzka044oian4jr17t1f0	MARLON T. GALINDO	marlon t galindo	cmpm7s7j8003liauswjjxk8ex	MATCHED	\N	t
cmpwh4nzp01pjia401l1xlq6b	cmpw9vzka044oian4jr17t1f0	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4nzx01plia4042yjqnrl	cmpw9vzka044oian4jr17t1f0	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4o0401pnia40r20bhxsb	cmpw9vzka044oian4jr17t1f0	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4o0b01ppia409ddc3235	cmpw9vzka044oian4jr17t1f0	CHRISTIAN JEN LABADO	christian jen labado	\N	UNMATCHED	\N	f
cmpwh4o0f01pria400edk6h05	cmpw9vzka044oian4jr17t1f0	MILAN GUTAY	milan gutay	\N	UNMATCHED	\N	f
cmpwh4o0h01ptia40oevxlght	cmpw9vzka044oian4jr17t1f0	JOSEEDGAR D. ESTRELLA	joseedgar d estrella	\N	UNMATCHED	\N	f
cmpwh4o0l01pvia40djdac6sb	cmpw9vzka044oian4jr17t1f0	GRAD LUCKY MARK ARCEGA	grad lucky mark arcega	\N	UNMATCHED	\N	f
cmpwh4o0o01pxia404cuf923k	cmpw9vzka044oian4jr17t1f0	CALUDEVAN MACABALE	caludevan macabale	\N	UNMATCHED	\N	f
cmpwh4o0r01pzia40x8w30uzo	cmpw9vzka044oian4jr17t1f0	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4o0z01q1ia40u55fey9r	cmpw9vzka044oian4jr17t1f0	RODELYN E. NAVAROSA	rodelyn e navarosa	cmpmcsydy005biaus8mz8wrn4	MATCHED	\N	t
cmpwh4o1p01q5ia40xa9wah74	cmpw9vzmr045gian4u0gs1wyb	LEE CHARGE S. CAILING	lee charge s cailing	cmpm70pwb002yiaus2m2fx6w0	MATCHED	\N	t
cmpwh4o2g01q9ia40vo3btf4y	cmpw9vznc045kian4vcvjf4g4	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4o2n01qbia40zj4ckmfo	cmpw9vznc045kian4vcvjf4g4	JERWIN A. ASIÑERO	jerwin a asiero	cmpm6jzck002siausjij512h3	MATCHED	\N	t
cmpwh4o2u01qdia40a3fl9rnw	cmpw9vznc045kian4vcvjf4g4	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4o3i01qhia40gli8zr7n	cmpw9vzok045sian4108trki8	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4o3o01qjia40v3ty2xow	cmpw9vzok045sian4108trki8	VEVIEN P. BACULIO	vevien p baculio	cmpm9wtav0040iaus5stdmg52	MATCHED	\N	t
cmpwh4o4f01qnia40onl281rx	cmpw9vzpa045yian42agvgnc4	JERWIN A. ASIÑERO	jerwin a asiero	cmpm6jzck002siausjij512h3	MATCHED	\N	t
cmpwh4o4o01qpia40op0es2uc	cmpw9vzpa045yian42agvgnc4	BRIAN JAY SACALA	brian jay sacala	cmpmaaekm0046iausrahtxbtp	MATCHED	\N	t
cmpwh4o5h01qtia40ba1b7v31	cmpw9vzq00464ian4cho74edg	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4o6d01qxia409hankujr	cmpw9vzql0468ian42obyzkp0	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4o6k01qzia405tik5jbt	cmpw9vzql0468ian42obyzkp0	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4o6r01r1ia40s24vstkg	cmpw9vzql0468ian42obyzkp0	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4o7i01r5ia40w5s6our4	cmpw9vzrj046gian47dxe9tl4	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4o8201r9ia409ofu9a7n	cmpw9vzrx046kian4ykjxd0ri	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	f
cmpwh4o8501rbia4010fttvjb	cmpw9vzrx046kian4ykjxd0ri	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	f
cmpwh4o8s01rfia40wowd04gl	cmpw9vzsi046qian4lghm00z0	JOHN MICHAEL C. OPPUS	john michael c oppus	\N	UNMATCHED	\N	f
cmpwh4o8v01rhia40e57q1v95	cmpw9vzsi046qian4lghm00z0	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4o9201rjia40zckidzq9	cmpw9vzsi046qian4lghm00z0	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4o9p01rnia4050vmba0p	cmpw9vzt7046yian4oyf5lh3v	JERWIN A. ASIÑERO	jerwin a asiero	cmpm6jzck002siausjij512h3	MATCHED	\N	t
cmpwh4o9v01rpia4017s6m59s	cmpw9vzt7046yian4oyf5lh3v	GRAD LUCKY MARK N. ARCEGA	grad lucky mark n arcega	cmpm4p7n6001qiausf4s5ahht	MATCHED	\N	t
cmpwh4oa201rria40o6ib99iw	cmpw9vzt7046yian4oyf5lh3v	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4ocz01rvia40s39gvo6i	cmpw9vzu30476ian45zj9w5al	MERLIE T. MONTERA	merlie t montera	cmpm7sv69003oiausjksd398m	MATCHED	\N	t
cmpwh4od601rxia400riebphn	cmpw9vzu30476ian45zj9w5al	RODELYN E. NAVAROSA	rodelyn e navarosa	cmpmcsydy005biaus8mz8wrn4	MATCHED	\N	t
cmpwh4odv01s1ia402kejgjql	cmpw9vzuw047cian49f80u9b4	CINDY B. DUMALOAN	cindy b dumaloan	cmpm7wjyu003riaus32ihl37b	MATCHED	\N	t
cmpwh4oe001s3ia40mai4vvmz	cmpw9vzuw047cian49f80u9b4	CHERRY MAE C. PARAJIS	cherry mae c parajis	\N	UNMATCHED	\N	f
cmpwh4oe301s5ia408p8kdans	cmpw9vzuw047cian49f80u9b4	MARLON GALINDO	marlon galindo	\N	UNMATCHED	\N	f
cmpwh4oe501s7ia40fz6d4x98	cmpw9vzuw047cian49f80u9b4	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4oed01s9ia401xzggkal	cmpw9vzuw047cian49f80u9b4	HECTOR PAYLANGCO	hector paylangco	\N	UNMATCHED	\N	f
cmpwh4oey01sdia40mgrx0yug	cmpw9vzvy047oian47w8zgyfz	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4of401sfia40223yz3pc	cmpw9vzvy047oian47w8zgyfz	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4ofb01shia40vr7imqin	cmpw9vzvy047oian47w8zgyfz	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4ofw01slia40yv76wsoz	cmpw9vzwu047wian49b8y9mbu	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4og301snia40dsvvhzuf	cmpw9vzwu047wian49b8y9mbu	KHIMBOY VERSON	khimboy verson	\N	UNMATCHED	\N	f
cmpwh4og701spia40u0cocp45	cmpw9vzwu047wian49b8y9mbu	HAZEL VALCORZA	hazel valcorza	\N	UNMATCHED	\N	f
cmpwh4ogv01stia4064bmg332	cmpw9vzxi0484ian4gkbxg47y	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4ohf01sxia40mfz61hmm	cmpw9vzy00488ian4klt6afry	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4ohn01szia40shblauqz	cmpw9vzy00488ian4klt6afry	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4oi701t3ia40gem1nu2c	cmpw9vzyn048eian4i6w5rfg2	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4oif01t5ia40aorw2of7	cmpw9vzyn048eian4i6w5rfg2	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4oil01t7ia4040rw1asp	cmpw9vzyn048eian4i6w5rfg2	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4oja01tbia40a5jsmqxs	cmpw9vzzl048mian4wzv1uv8y	JOSE EDGAR D. ESTRELLA	jose edgar d estrella	cmpm7p9r4003ciausxxtm77m0	MATCHED	\N	t
cmpwh4ojf01tdia405tt5bao7	cmpw9vzzl048mian4wzv1uv8y	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4ok201thia40ez0p5rhr	cmpw9w00d048sian4u23eegjo	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4ok801tjia401iif5qfj	cmpw9w00d048sian4u23eegjo	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4okv01tnia40o42j1hdp	cmpw9w017048yian4g37tknu0	MARLON T. GALINDO	marlon t galindo	cmpm7s7j8003liauswjjxk8ex	MATCHED	\N	t
cmpwh4ol101tpia408vf94v4q	cmpw9w017048yian4g37tknu0	KATHLEEN MARIE P. MEDEL	kathleen marie p medel	cmpmakc8i004liaus6oylw747	MATCHED	\N	t
cmpwh4ol701tria40dpmr1pb9	cmpw9w017048yian4g37tknu0	ANGEL MARIE C. GUILLENA	angel marie c guillena	cmpmcmiud0058iaustuwfw2sp	MATCHED	\N	t
cmpwh4ole01ttia40m3vpwp6z	cmpw9w017048yian4g37tknu0	RODELYN E. NAVAROSA	rodelyn e navarosa	cmpmcsydy005biaus8mz8wrn4	MATCHED	\N	t
cmpwh4olk01tvia404s26c51b	cmpw9w017048yian4g37tknu0	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4om601tzia40hp6zs9xh	cmpw9w02n049aian4ughmdtv3	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4omc01u1ia40z2ogpi8o	cmpw9w02n049aian4ughmdtv3	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4omy01u5ia40quw29lcg	cmpw9w03m049gian4i6bgf3ez	MARIA GUADA F. DOSDOS	maria guada f dosdos	cmpm7z8kc003xiauswx84u6ek	MATCHED	\N	t
cmpwh4on401u7ia40er8ojyhy	cmpw9w03m049gian4i6bgf3ez	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4onq01ubia40zam5drtc	cmpw9w049049mian40ia4ce49	MARIA GUADA F. DOSDOS	maria guada f dosdos	cmpm7z8kc003xiauswx84u6ek	MATCHED	\N	t
cmpwh4onw01udia40o178knwn	cmpw9w049049mian40ia4ce49	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4oo001ufia40nbmjtnvf	cmpw9w049049mian40ia4ce49	JC SWEET P. SIOS-E	jc sweet p siose	\N	UNMATCHED	\N	f
cmpwh4oo301uhia4055fshw4t	cmpw9w049049mian40ia4ce49	HAZEL D. VALCORZA	hazel d valcorza	\N	UNMATCHED	\N	f
cmpwh4oo501ujia40536srqf9	cmpw9w049049mian40ia4ce49	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4oop01unia40u3gcqw4v	cmpw9w05d049yian45yie0chm	SHEILA P. DE GALA	sheila p de gala	\N	UNMATCHED	\N	f
cmpwh4oor01upia40ersf0s9b	cmpw9w05d049yian45yie0chm	ANGEL MARIE C. GUILLENA	angel marie c guillena	cmpmcmiud0058iaustuwfw2sp	MATCHED	\N	t
cmpwh4oow01uria40ig588cxf	cmpw9w05d049yian45yie0chm	RODELYN E. NAVAROSA	rodelyn e navarosa	cmpmcsydy005biaus8mz8wrn4	MATCHED	\N	t
cmpwh4opx01uwia405klex5jl	cmpw9w06e04a6ian4ceoodajv	SHEILA P. DE GALA	sheila p de gala	\N	UNMATCHED	\N	f
cmpwh4oq001uyia40ueen4iuo	cmpw9w06e04a6ian4ceoodajv	JOSELINO C.  UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4oqg01v2ia40khvgp701	cmpw9w06x04acian4jh88qhz7	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4oql01v4ia40937g0mc1	cmpw9w06x04acian4jh88qhz7	SHEILA P. DE GALA	sheila p de gala	\N	UNMATCHED	\N	f
cmpwh4or301v8ia402zj8ahkf	cmpw9w07l04aiian4bl1sx7al	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4orl01vcia40cajpghpt	cmpw9w08104amian4zmba4w9j	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4orq01veia40dzdwbhsh	cmpw9w08104amian4zmba4w9j	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4oru01vgia40j15s61g8	cmpw9w08104amian4zmba4w9j	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4osg01vkia40jgu94ph6	cmpw9w09104auian4qweziu5s	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4osl01vmia40vgpzjws9	cmpw9w09104auian4qweziu5s	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4ot201vqia40da1t7el5	cmpw9w09u04b0ian4mfy98dmp	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	f
cmpwh4ot501vsia4054ki9xp9	cmpw9w09u04b0ian4mfy98dmp	AARON ALLEN CAINGLET	aaron allen cainglet	\N	UNMATCHED	\N	f
cmpwh4ot701vuia404suvpj42	cmpw9w09u04b0ian4mfy98dmp	VEVIEN P. BACULIO	vevien p baculio	cmpm9wtav0040iaus5stdmg52	MATCHED	\N	f
cmpwh4ot901vwia40ktebp6ag	cmpw9w09u04b0ian4mfy98dmp	CLARISSA L. NICO	clarissa l nico	cmpmcyll0005tiaus9udmpd06	MATCHED	\N	f
cmpwh4otc01vyia407129pnhq	cmpw9w09u04b0ian4mfy98dmp	EDNA C. FUENTES	edna c fuentes	\N	UNMATCHED	\N	f
cmpwh4ote01w0ia40pooukvxt	cmpw9w09u04b0ian4mfy98dmp	REGIE C. SATUR	regie c satur	\N	UNMATCHED	\N	f
cmpwh4otg01w2ia40kmqm515v	cmpw9w09u04b0ian4mfy98dmp	LERIO P. LAURENTE	lerio p laurente	\N	UNMATCHED	\N	f
cmpwh4oti01w4ia40ianbw8ro	cmpw9w09u04b0ian4mfy98dmp	ILDEFONSO III M. NACARIO	ildefonso iii m nacario	\N	UNMATCHED	\N	f
cmpwh4otk01w6ia40k6fexwh0	cmpw9w09u04b0ian4mfy98dmp	CORA B. RAPIRAP	cora b rapirap	\N	UNMATCHED	\N	f
cmpwh4otm01w8ia40plrvg8c5	cmpw9w09u04b0ian4mfy98dmp	ZYRRA N. VICIO	zyrra n vicio	\N	UNMATCHED	\N	f
cmpwh4oto01waia40yameoo5h	cmpw9w09u04b0ian4mfy98dmp	BLAZE ANGELIE C. BRILLANTES	blaze angelie c brillantes	\N	UNMATCHED	\N	f
cmpwh4otq01wcia40fmje9s0w	cmpw9w09u04b0ian4mfy98dmp	JONESIO B. SENAJON	jonesio b senajon	\N	UNMATCHED	\N	f
cmpwh4ots01weia40mmudic9c	cmpw9w09u04b0ian4mfy98dmp	KATHYRINE S. QUE-E	kathyrine s quee	\N	UNMATCHED	\N	f
cmpwh4otu01wgia40w75v4fe9	cmpw9w09u04b0ian4mfy98dmp	PAUL REGINE V. ANGELES	paul regine v angeles	\N	UNMATCHED	\N	f
cmpwh4otx01wiia40nj622t0t	cmpw9w09u04b0ian4mfy98dmp	JERICO BALBUTIN	jerico balbutin	\N	UNMATCHED	\N	f
cmpwh4otz01wkia40exwc4gxc	cmpw9w09u04b0ian4mfy98dmp	MARGIE D. SANCHEZ	margie d sanchez	\N	UNMATCHED	\N	f
cmpwh4ou201wmia40bhrnpt8n	cmpw9w09u04b0ian4mfy98dmp	DARYL P. BONGGA	daryl p bongga	\N	UNMATCHED	\N	f
cmpwh4ouk01wqia404qpkjm5i	cmpw9w0br04c0ian4ib6cxah3	CLARISSA L. NICO	clarissa l nico	cmpmcyll0005tiaus9udmpd06	MATCHED	\N	f
cmpwh4ouo01wsia40xiyfuo1k	cmpw9w0br04c0ian4ib6cxah3	RONEL L. LAMERA	ronel l lamera	\N	UNMATCHED	\N	f
cmpwh4our01wuia40pto6he1l	cmpw9w0br04c0ian4ib6cxah3	MARY ANN D. REMOLE	mary ann d remole	\N	UNMATCHED	\N	f
cmpwh4out01wwia40vpxeb8kz	cmpw9w0br04c0ian4ib6cxah3	NATZ SIA	natz sia	\N	UNMATCHED	\N	f
cmpwh4ouw01wyia403vg5ana7	cmpw9w0br04c0ian4ib6cxah3	RECHEL SATUR	rechel satur	\N	UNMATCHED	\N	f
cmpwh4ouy01x0ia40dfjqqvws	cmpw9w0br04c0ian4ib6cxah3	KRISTEL FLORES	kristel flores	\N	UNMATCHED	\N	f
cmpwh4ov101x2ia40xtp97b0k	cmpw9w0br04c0ian4ib6cxah3	HELEN LEGASPI	helen legaspi	\N	UNMATCHED	\N	f
cmpwh4ov301x4ia40xja393rr	cmpw9w0br04c0ian4ib6cxah3	AUBREY OCZON	aubrey oczon	\N	UNMATCHED	\N	f
cmpwh4ov701x6ia40jw5580ug	cmpw9w0br04c0ian4ib6cxah3	FATHIMA ASINIERO	fathima asiniero	\N	UNMATCHED	\N	f
cmpwh4ov901x8ia40d6lswjit	cmpw9w0br04c0ian4ib6cxah3	ASLIMA PASCAN	aslima pascan	\N	UNMATCHED	\N	f
cmpwh4ovq01xcia40dpt1cgkq	cmpw9w0d204cmian4lwq3vefg	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	f
cmpwh4ovs01xeia405m29rdwq	cmpw9w0d204cmian4lwq3vefg	VEVIEN P. BACULIO	vevien p baculio	cmpm9wtav0040iaus5stdmg52	MATCHED	\N	f
cmpwh4ovu01xgia40idf494x1	cmpw9w0d204cmian4lwq3vefg	GRACE JESSICA G. MANGCO	grace jessica g mangco	\N	UNMATCHED	\N	f
cmpwh4ovx01xiia404lwmkb4i	cmpw9w0d204cmian4lwq3vefg	LYN S. SANTOS	lyn s santos	\N	UNMATCHED	\N	f
cmpwh4ow001xkia40l30qbbbd	cmpw9w0d204cmian4lwq3vefg	MARITES N. GOMEZ	marites n gomez	\N	UNMATCHED	\N	f
cmpwh4owg01xoia40s73f0p0u	cmpw9w0dz04cyian41b5m0nzh	MARIA GUADA F. DOSDOS	maria guada f dosdos	cmpm7z8kc003xiauswx84u6ek	MATCHED	\N	t
cmpwh4owl01xqia40egwsa3qr	cmpw9w0dz04cyian41b5m0nzh	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4owp01xsia402urt6f4p	cmpw9w0dz04cyian41b5m0nzh	KHIMBOY B. VERSON	khimboy b verson	\N	UNMATCHED	\N	f
cmpwh4owr01xuia403yyxaqzj	cmpw9w0dz04cyian41b5m0nzh	CATHERINE B. CAWALING	catherine b cawaling	\N	UNMATCHED	\N	f
cmpwh4owu01xwia40vxswgaxd	cmpw9w0dz04cyian41b5m0nzh	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4oxc01y0ia40t4n3icq8	cmpw9w0f704daian4m7dn6j9i	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4oxu01y4ia40n3fmyfkd	cmpw9w0ft04deian4i55roifm	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4ozq01yjia403n0fcrol	cmpw9w0g104dhian44nruhhfo	LEE CHARGE S. CAILING	lee charge s cailing	cmpm70pwb002yiaus2m2fx6w0	MATCHED	\N	t
cmpwh4p0a01ynia40n7jhaci4	cmpw9w0gn04dlian4p2ggd11h	MARLON T. GALINDO	marlon t galindo	cmpm7s7j8003liauswjjxk8ex	MATCHED	\N	t
cmpwh4p0g01ypia40ghhl88hv	cmpw9w0gn04dlian4p2ggd11h	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4p0z01yuia4090c62ejh	cmpw9w0hd04drian41r2bpewn	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4p1401ywia40ki2h5k81	cmpw9w0hd04drian41r2bpewn	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4p1901yyia40u9e5rhz8	cmpw9w0hd04drian41r2bpewn	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4p1t01z3ia40nxz0kw36	cmpw9w0i504dzian4xop9lm5o	MILAN L. GUTAY	milan l gutay	cmpm7q17h003fiausimucssfj	MATCHED	\N	t
cmpwh4p1y01z5ia40xr0um99e	cmpw9w0i504dzian4xop9lm5o	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4p2001z7ia40ijexu2ex	cmpw9w0i504dzian4xop9lm5o	JOMILYN CABUNOC	jomilyn cabunoc	\N	UNMATCHED	\N	f
cmpwh4p2101z9ia40hxjl9105	cmpw9w0i504dzian4xop9lm5o	JEROME GENGANIA	jerome gengania	\N	UNMATCHED	\N	f
cmpwh4p2301zbia40a1kqcaf0	cmpw9w0i504dzian4xop9lm5o	TITA VASQUEZ	tita vasquez	\N	UNMATCHED	\N	f
cmpwh4p2n01zgia407mcgbx5i	cmpw9w0j104ebian43xj9si1b	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4p3101zkia40ts3ez3py	cmpw9w0ji04efian481kq97rc	MARLON T. GALINDO	marlon t galindo	cmpm7s7j8003liauswjjxk8ex	MATCHED	\N	t
cmpwh4p3701zmia40qvuxouxq	cmpw9w0ji04efian481kq97rc	ANGEL MARIE C. GUILLENA	angel marie c guillena	cmpmcmiud0058iaustuwfw2sp	MATCHED	\N	t
cmpwh4p3d01zoia404lpswiq3	cmpw9w0ji04efian481kq97rc	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4p3t01zsia40uiaknpz1	cmpw9w0k704enian4wggh6uw9	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	f
cmpwh4p3x01zuia40eob3pf1u	cmpw9w0k704enian4wggh6uw9	JERWIN A. ASIÑERO	jerwin a asiero	cmpm6jzck002siausjij512h3	MATCHED	\N	f
cmpwh4p3z01zwia40kzbjlvh5	cmpw9w0k704enian4wggh6uw9	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	f
cmpwh4p4101zyia40zvfi9bkn	cmpw9w0k704enian4wggh6uw9	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	f
cmpwh4p440200ia40n3glbepg	cmpw9w0k704enian4wggh6uw9	RODELYN E. NAVAROSA	rodelyn e navarosa	cmpmcsydy005biaus8mz8wrn4	MATCHED	\N	f
cmpwh4p460202ia40n9amwsiu	cmpw9w0k704enian4wggh6uw9	NICOLETTE J. DAWIS	nicolette j dawis	\N	UNMATCHED	\N	f
cmpwh4p480204ia40cm8eic1o	cmpw9w0k704enian4wggh6uw9	ARNEL L. EGANTUCAN	arnel l egantucan	\N	UNMATCHED	\N	f
cmpwh4p4a0206ia40iv0fo1em	cmpw9w0k704enian4wggh6uw9	ROMULO V. SABELLITA	romulo v sabellita	\N	UNMATCHED	\N	f
cmpwh4p4c0208ia401vm5e0pj	cmpw9w0k704enian4wggh6uw9	TRIXIE MAE M. SAHIRIN	trixie mae m sahirin	\N	UNMATCHED	\N	f
cmpwh4p4e020aia40y64oamer	cmpw9w0k704enian4wggh6uw9	JADE D. DALID	jade d dalid	\N	UNMATCHED	\N	f
cmpwh4p4t020eia40nm9xvkr8	cmpw9w0lk04f9ian42mqx53vz	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4p4y020gia40n1hmxyl2	cmpw9w0lk04f9ian42mqx53vz	JERWIN A. ASIÑERO	jerwin a asiero	cmpm6jzck002siausjij512h3	MATCHED	\N	t
cmpwh4p53020iia405p26nh0j	cmpw9w0lk04f9ian42mqx53vz	GRAD LUCKY MARK N. ARCEGA	grad lucky mark n arcega	cmpm4p7n6001qiausf4s5ahht	MATCHED	\N	t
cmpwh4p58020kia409momdcvn	cmpw9w0lk04f9ian42mqx53vz	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4p5c020mia400ss0s4iu	cmpw9w0lk04f9ian42mqx53vz	BRIAN JAY SACALA	brian jay sacala	cmpmaaekm0046iausrahtxbtp	MATCHED	\N	t
cmpwh4p5h020oia40c9da9pd0	cmpw9w0lk04f9ian42mqx53vz	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4p5m020qia401cfxfxgv	cmpw9w0lk04f9ian42mqx53vz	RONEL L. LLAMERA	ronel l llamera	cmpmcv3uk005kiausndde2tr6	MATCHED	\N	t
cmpwh4p65020uia40u3atnb8g	cmpw9w0ne04fpian4nbwqrfjj	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4p69020wia40l54ysjdh	cmpw9w0ne04fpian4nbwqrfjj	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4p6b020yia404zniva7j	cmpw9w0ne04fpian4nbwqrfjj	CATHERINE G. CAWALING	catherine g cawaling	\N	UNMATCHED	\N	f
cmpwh4p6d0210ia40aqql2jyo	cmpw9w0ne04fpian4nbwqrfjj	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4p6u0214ia40mqkvxyoj	cmpw9w0o604fzian4xxheze4w	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4p6z0216ia40rgmxpli0	cmpw9w0o604fzian4xxheze4w	VEVIEN P. BACULIO	vevien p baculio	cmpm9wtav0040iaus5stdmg52	MATCHED	\N	t
cmpwh4p7h021aia40b44jk6y0	cmpw9w0p004g5ian4ar99kn7w	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4p7l021cia40836wo05b	cmpw9w0p004g5ian4ar99kn7w	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4p7q021eia4023o9s4jw	cmpw9w0p004g5ian4ar99kn7w	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4p8c021iia40k05oo56k	cmpw9w0px04gdian4cc80oev1	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4p8i021kia40c12l8g77	cmpw9w0px04gdian4cc80oev1	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4p8m021mia40p3l2vr7d	cmpw9w0px04gdian4cc80oev1	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4p95021qia40iwoicddd	cmpw9w0qx04glian4qour220v	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	f
cmpwh4p97021sia40kwiz5nqp	cmpw9w0qx04glian4qour220v	GRAD LUCKY MARK N. ARCEGA	grad lucky mark n arcega	cmpm4p7n6001qiausf4s5ahht	MATCHED	\N	f
cmpwh4p99021uia40afwg038t	cmpw9w0qx04glian4qour220v	ARMANDO MATULAC	armando matulac	\N	UNMATCHED	\N	f
cmpwh4p9c021wia40due54eqb	cmpw9w0qx04glian4qour220v	MENA LAPE	mena lape	\N	UNMATCHED	\N	f
cmpwh4p9e021yia40elxfz4ug	cmpw9w0qx04glian4qour220v	MA. REGINA GIMENA	ma regina gimena	\N	UNMATCHED	\N	f
cmpwh4p9i0220ia40hdypk8y5	cmpw9w0qx04glian4qour220v	ROSE MAY ILAGO	rose may ilago	\N	UNMATCHED	\N	f
cmpwh4p9k0222ia40rf00432z	cmpw9w0qx04glian4qour220v	LORETA ANTONIO	loreta antonio	\N	UNMATCHED	\N	f
cmpwh4p9n0224ia40jt2jijix	cmpw9w0qx04glian4qour220v	JOSIE DADANG	josie dadang	\N	UNMATCHED	\N	f
cmpwh4p9p0226ia40yke185xe	cmpw9w0qx04glian4qour220v	MERLYNDA BORRES	merlynda borres	\N	UNMATCHED	\N	f
cmpwh4p9r0228ia402za0847x	cmpw9w0qx04glian4qour220v	ALQUIN BAA	alquin baa	\N	UNMATCHED	\N	f
cmpwh4p9t022aia40095hct8u	cmpw9w0qx04glian4qour220v	LANI TRAZONA	lani trazona	\N	UNMATCHED	\N	f
cmpwh4p9w022cia40sf0skzbp	cmpw9w0qx04glian4qour220v	KATHLEEN MARIE P. MEDEL	kathleen marie p medel	cmpmakc8i004liaus6oylw747	MATCHED	\N	f
cmpwh4pae022gia40m6h1talx	cmpw9w0sc04hbian4gbzrcgf7	ARMANDO MATULAC	armando matulac	\N	UNMATCHED	\N	f
cmpwh4pah022iia4058xyhpur	cmpw9w0sc04hbian4gbzrcgf7	MENA LAPE	mena lape	\N	UNMATCHED	\N	f
cmpwh4paj022kia402bkvfxy4	cmpw9w0sc04hbian4gbzrcgf7	MA. RECHEL GIMENA	ma rechel gimena	\N	UNMATCHED	\N	f
cmpwh4pal022mia401nfgih99	cmpw9w0sc04hbian4gbzrcgf7	ROSE MAY ILAGO	rose may ilago	\N	UNMATCHED	\N	f
cmpwh4pao022oia40k1uhr1pv	cmpw9w0sc04hbian4gbzrcgf7	LORETA ANTONIO	loreta antonio	\N	UNMATCHED	\N	f
cmpwh4paq022qia408nsq688k	cmpw9w0sc04hbian4gbzrcgf7	JOSIE DADANG	josie dadang	\N	UNMATCHED	\N	f
cmpwh4pat022sia40l8volml1	cmpw9w0sc04hbian4gbzrcgf7	MERLYNDA BORRES	merlynda borres	\N	UNMATCHED	\N	f
cmpwh4paw022uia40s2j3pm5r	cmpw9w0sc04hbian4gbzrcgf7	ALQUIN BAA	alquin baa	\N	UNMATCHED	\N	f
cmpwh4pay022wia40qf0qa2k6	cmpw9w0sc04hbian4gbzrcgf7	LANI TRAZONA	lani trazona	\N	UNMATCHED	\N	f
cmpwh4pub029hia403at64ez8	cmpw7i0rv03dnian4s0vug93r	SHEILA P. DE GALA	sheila p de gala	\N	UNMATCHED	\N	f
cmpwh4pbf0230ia40p3w31yr1	cmpw7i072037bian4jmedeuvp	GRAD LUCKY MARK N. ARCEGA	grad lucky mark n arcega	cmpm4p7n6001qiausf4s5ahht	MATCHED	\N	t
cmpwh4pc10234ia40f8y2vhgb	cmpw7i07l037fian4csya39i4	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4pc60236ia407qzt28op	cmpw7i07l037fian4csya39i4	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4pc80238ia40vnef0agj	cmpw7i07l037fian4csya39i4	SHAINA CLAIRE A. CAGAS	shaina claire a cagas	\N	UNMATCHED	\N	f
cmpwh4pco023cia40z38ibprb	cmpw7i08b037nian4xvevqe4n	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4pct023eia40lsogv69k	cmpw7i08b037nian4xvevqe4n	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4pcu023gia40heet153q	cmpw7i08b037nian4xvevqe4n	CATHERINE G. CAWALING	catherine g cawaling	\N	UNMATCHED	\N	f
cmpwh4pcx023iia40du6hs19s	cmpw7i08b037nian4xvevqe4n	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4pdl023mia40qj1lb22p	cmpw7i090037xian44q8vxfws	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4pdr023oia4025a7x96b	cmpw7i090037xian44q8vxfws	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4pdw023qia405pcekw1g	cmpw7i090037xian44q8vxfws	MARCELO E. TOLDEDO JR.	marcelo e toldedo jr	\N	UNMATCHED	\N	f
cmpwh4pec023uia40qe87rsuc	cmpw7i09s0385ian48k7ju6pv	MARIA GUADA F. DOSDOS	maria guada f dosdos	cmpm7z8kc003xiauswx84u6ek	MATCHED	\N	t
cmpwh4peh023wia40q2689vgx	cmpw7i09s0385ian48k7ju6pv	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4pel023yia40n85me6sc	cmpw7i09s0385ian48k7ju6pv	KHIMBOY B. VERSON	khimboy b verson	\N	UNMATCHED	\N	f
cmpwh4pen0240ia40pzldkxe6	cmpw7i09s0385ian48k7ju6pv	SHAINA CLAIRE A. CAGAS	shaina claire a cagas	\N	UNMATCHED	\N	f
cmpwh4pep0242ia40kebmfge6	cmpw7i09s0385ian48k7ju6pv	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4pf40246ia406nyvhkno	cmpw7i0aq038hian4zw531gi2	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4pf90248ia408s9qej7k	cmpw7i0aq038hian4zw531gi2	JC SWEET P. SIOS E	jc sweet p sios e	\N	UNMATCHED	\N	f
cmpwh4pfb024aia40z7bnv41z	cmpw7i0aq038hian4zw531gi2	HAZEL VALCORZA	hazel valcorza	\N	UNMATCHED	\N	f
cmpwh4pft024eia40cmmjpw5y	cmpw7i0bh038pian4e6ajbq6d	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4pfy024gia40rjh3uhdp	cmpw7i0bh038pian4e6ajbq6d	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4pg0024iia40n5qpqb1t	cmpw7i0bh038pian4e6ajbq6d	SHAINA CLAIRE A. CAGAS	shaina claire a cagas	\N	UNMATCHED	\N	f
cmpwh4pgl024mia40hiuf93lo	cmpw7i0c6038xian4wkfykxzz	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4pgs024oia40ekt7azpx	cmpw7i0c6038xian4wkfykxzz	SHAINA CLAIRE A. CAGAS	shaina claire a cagas	\N	UNMATCHED	\N	f
cmpwh4pha024sia401vi066i7	cmpw7i0cr0393ian4ejm0jpcj	MARIA GUADA F. DOSDOS	maria guada f dosdos	cmpm7z8kc003xiauswx84u6ek	MATCHED	\N	t
cmpwh4phg024uia40qne3t9ti	cmpw7i0cr0393ian4ejm0jpcj	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4pi2024yia40q5pe4b92	cmpw7i0dg0399ian47giqfwpb	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4pi70250ia40y3csp4uq	cmpw7i0dg0399ian47giqfwpb	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4pin0254ia40dhrihkvz	cmpw7i0e2039fian496m5lrri	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4pis0256ia40x3tvezql	cmpw7i0e2039fian496m5lrri	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4pji025bia403yjksjmw	cmpw7i0ev039lian4vd1jzx4t	JEMIMA P. GUTOC	jemima p gutoc	cmpm7nzmm0039iauss19l621g	MATCHED	\N	t
cmpwh4pjm025dia400zee6emr	cmpw7i0ev039lian4vd1jzx4t	MARIA GUADA F. DOSDOS	maria guada f dosdos	cmpm7z8kc003xiauswx84u6ek	MATCHED	\N	t
cmpwh4pjs025fia40pnzxkzep	cmpw7i0ev039lian4vd1jzx4t	MARLON T. GALINDO	marlon t galindo	cmpm7s7j8003liauswjjxk8ex	MATCHED	\N	t
cmpwh4pjx025hia409zqqeq2p	cmpw7i0ev039lian4vd1jzx4t	JOSE EDGAR D. ESTRELLA	jose edgar d estrella	cmpm7p9r4003ciausxxtm77m0	MATCHED	\N	t
cmpwh4pk2025jia40664v948f	cmpw7i0ev039lian4vd1jzx4t	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4pk6025lia402zrdzhum	cmpw7i0ev039lian4vd1jzx4t	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4pkc025nia40sidrqk2g	cmpw7i0ev039lian4vd1jzx4t	ANGEL MARIE C. GUILLENA	angel marie c guillena	cmpmcmiud0058iaustuwfw2sp	MATCHED	\N	t
cmpwh4pkh025pia40l4jvpz9d	cmpw7i0ev039lian4vd1jzx4t	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4pl1025tia40eot7f2bj	cmpw7i0gv03a3ian4ibnaxsws	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4pl5025via404uz5j14r	cmpw7i0gv03a3ian4ibnaxsws	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4pla025xia40xcttabrr	cmpw7i0gv03a3ian4ibnaxsws	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4plr0261ia405dy2shjo	cmpw7i0hv03abian4o9949qgi	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4plv0263ia40i6hd6c19	cmpw7i0hv03abian4o9949qgi	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4pm00265ia4000ws2o8p	cmpw7i0hv03abian4o9949qgi	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4pmi0269ia403nr29jti	cmpw7i0iv03ajian4s1wauowv	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4pmk026bia407gowy0qi	cmpw7i0iv03ajian4s1wauowv	CATHERINE G. CAWALING	catherine g cawaling	\N	UNMATCHED	\N	f
cmpwh4pmn026dia4061asdv13	cmpw7i0iv03ajian4s1wauowv	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4pn2026hia40hjoo29bo	cmpw7i0jf03arian48lanfw5o	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4pn7026jia405wzmwl7y	cmpw7i0jf03arian48lanfw5o	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4pnd026lia40rppwba83	cmpw7i0jf03arian48lanfw5o	MARCELO E. TOLEDO JR. .	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4pnt026pia40g00zcwyi	cmpw7i0k803azian4low01vij	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4pob026tia40e09w9e2r	cmpw7i0ks03b3ian4ygmhxu3o	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	f
cmpwh4pod026via40vp6q1sv4	cmpw7i0ks03b3ian4ygmhxu3o	ADAMS CHRISTOPHER P. SISOS-E	adams christopher p sisose	\N	UNMATCHED	\N	f
cmpwh4pof026xia40lbsc7h23	cmpw7i0ks03b3ian4ygmhxu3o	VEVIEN P. BACULIO	vevien p baculio	cmpm9wtav0040iaus5stdmg52	MATCHED	\N	f
cmpwh4poh026zia40fxba3v4w	cmpw7i0ks03b3ian4ygmhxu3o	CLARISSA L. NICO	clarissa l nico	cmpmcyll0005tiaus9udmpd06	MATCHED	\N	f
cmpwh4pok0271ia40wutwm2zz	cmpw7i0ks03b3ian4ygmhxu3o	GRACE JESSICA G. MANGCO	grace jessica g mangco	\N	UNMATCHED	\N	f
cmpwh4pol0273ia4068xvlfok	cmpw7i0ks03b3ian4ygmhxu3o	LYN S. SANTOS	lyn s santos	\N	UNMATCHED	\N	f
cmpwh4pon0275ia40dqm6l68j	cmpw7i0ks03b3ian4ygmhxu3o	MARITES N. GOMEZ	marites n gomez	\N	UNMATCHED	\N	f
cmpwh4poq0277ia40uxobtz6h	cmpw7i0ks03b3ian4ygmhxu3o	CINDY N. GOMEZ	cindy n gomez	\N	UNMATCHED	\N	f
cmpwh4pos0279ia40qlkwc4ve	cmpw7i0ks03b3ian4ygmhxu3o	JINKY VILLADORES	jinky villadores	\N	UNMATCHED	\N	f
cmpwh4pou027bia4083sw4req	cmpw7i0ks03b3ian4ygmhxu3o	LIZLY BIRAO	lizly birao	\N	UNMATCHED	\N	f
cmpwh4pox027dia40jgfzvz7i	cmpw7i0ks03b3ian4ygmhxu3o	CARMELO PABATAO	carmelo pabatao	\N	UNMATCHED	\N	f
cmpwh4poz027fia40rawuw0ol	cmpw7i0ks03b3ian4ygmhxu3o	MARY JANE LOSAÑES	mary jane losaes	\N	UNMATCHED	\N	f
cmpwh4pp2027hia4001i602f6	cmpw7i0ks03b3ian4ygmhxu3o	LOLITA ANGUS	lolita angus	\N	UNMATCHED	\N	f
cmpwh4pp4027jia40fbgjhjcf	cmpw7i0ks03b3ian4ygmhxu3o	NIEL BALAGOT	niel balagot	\N	UNMATCHED	\N	f
cmpwh4pp6027lia40mtvhufha	cmpw7i0ks03b3ian4ygmhxu3o	ERNIEL PAULO IBOT	erniel paulo ibot	\N	UNMATCHED	\N	f
cmpwh4pp7027nia40xzda4kcb	cmpw7i0ks03b3ian4ygmhxu3o	RICHARD PABATAO	richard pabatao	\N	UNMATCHED	\N	f
cmpwh4ppu027sia40wo180q1k	cmpw7i0mr03c1ian4vvk35bk2	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4ppz027uia40vcq5oj64	cmpw7i0mr03c1ian4vvk35bk2	MERLIE T. MONTERA	merlie t montera	cmpm7sv69003oiausjksd398m	MATCHED	\N	t
cmpwh4pq4027wia40bbkdi95u	cmpw7i0mr03c1ian4vvk35bk2	JEMIMA P. GUTOC	jemima p gutoc	cmpm7nzmm0039iauss19l621g	MATCHED	\N	t
cmpwh4pq9027yia40nu1ir8tm	cmpw7i0mr03c1ian4vvk35bk2	JOSE EDGAR D. ESTRELLA	jose edgar d estrella	cmpm7p9r4003ciausxxtm77m0	MATCHED	\N	t
cmpwh4pqc0280ia40dv50edk9	cmpw7i0mr03c1ian4vvk35bk2	MARIA GUADA F. DOSDOS	maria guada f dosdos	cmpm7z8kc003xiauswx84u6ek	MATCHED	\N	t
cmpwh4pqi0282ia40wsfe7ba1	cmpw7i0mr03c1ian4vvk35bk2	BIAN JAY SACALA	bian jay sacala	\N	UNMATCHED	\N	f
cmpwh4pqk0284ia40eskqrj9r	cmpw7i0mr03c1ian4vvk35bk2	MARLON T. GALINDO	marlon t galindo	cmpm7s7j8003liauswjjxk8ex	MATCHED	\N	t
cmpwh4pqp0286ia40fcoyo0y4	cmpw7i0mr03c1ian4vvk35bk2	VEVIEN P. BACULIO	vevien p baculio	cmpm9wtav0040iaus5stdmg52	MATCHED	\N	t
cmpwh4pqu0288ia40zb2c7ibu	cmpw7i0mr03c1ian4vvk35bk2	SHEILA P. DE GALA	sheila p de gala	\N	UNMATCHED	\N	f
cmpwh4pqw028aia40odbu5mnw	cmpw7i0mr03c1ian4vvk35bk2	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4pr1028cia40lzcpr28z	cmpw7i0mr03c1ian4vvk35bk2	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4prk028gia40dycf1wry	cmpw7i0p803cpian446htqfi0	LEE CHARGE S. CAILING	lee charge s cailing	cmpm70pwb002yiaus2m2fx6w0	MATCHED	\N	f
cmpwh4prn028iia40fcnbbcq9	cmpw7i0p803cpian446htqfi0	KATHLEEN P. MEDEL	kathleen p medel	\N	UNMATCHED	\N	f
cmpwh4prp028kia40tfzynr3f	cmpw7i0p803cpian446htqfi0	JOSIE P. DADANG	josie p dadang	\N	UNMATCHED	\N	f
cmpwh4prr028mia40g5kyme5m	cmpw7i0p803cpian446htqfi0	MENA LAPE	mena lape	\N	UNMATCHED	\N	f
cmpwh4pru028oia40s39zz7jr	cmpw7i0p803cpian446htqfi0	MA. RACHEL GIMENA	ma rachel gimena	\N	UNMATCHED	\N	f
cmpwh4prw028qia40wb7o8gvs	cmpw7i0p803cpian446htqfi0	ROSE MAY ILAGO	rose may ilago	\N	UNMATCHED	\N	f
cmpwh4pud029jia40z6v3os76	cmpw7i0rv03dnian4s0vug93r	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4puf029lia40mrpqn0pv	cmpw7i0rv03dnian4s0vug93r	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4puy029pia400tdjuour	cmpw7i0so03dvian4jojoupev	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4pv3029ria40266bs6fb	cmpw7i0so03dvian4jojoupev	SHELA P. DE GALA	shela p de gala	\N	UNMATCHED	\N	f
cmpwh4pvi029via40be9hl7az	cmpw7i0tf03e1ian48wafhgcy	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4pvy029zia40br93nzjt	cmpw7i0u103e5ian4089jlmgg	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4pwg02a3ia40taw3ofp9	cmpw7i0uo03e9ian42wzwzpyg	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4pwm02a5ia4071ks71vh	cmpw7i0uo03e9ian42wzwzpyg	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4pws02a7ia40hzlm3qre	cmpw7i0uo03e9ian42wzwzpyg	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4pwx02a9ia40lqmx0lj4	cmpw7i0uo03e9ian42wzwzpyg	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4pxn02adia40p6vg2y5c	cmpw7i0vs03ejian4yqw8rhpc	JERWIN A. ASIÑERO	jerwin a asiero	cmpm6jzck002siausjij512h3	MATCHED	\N	t
cmpwh4pxr02afia407u03z2fb	cmpw7i0vs03ejian4yqw8rhpc	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4py802ajia40xx2vxuzg	cmpw7i0wk03epian454icnzap	JERWIN A. ASIÑERO	jerwin a asiero	cmpm6jzck002siausjij512h3	MATCHED	\N	t
cmpwh4pyd02alia40n55x3apx	cmpw7i0wk03epian454icnzap	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4pyw02apia40dl5fajg1	cmpw7i0x703evian41oii8051	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4pz002aria40vosf9yuy	cmpw7i0x703evian41oii8051	VEVIEN P. BACULIO	vevien p baculio	cmpm9wtav0040iaus5stdmg52	MATCHED	\N	t
cmpwh4pzk02avia402fkg9e19	cmpw7i0y203f1ian4cpul3he0	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4q0102azia40bya4vlt8	cmpw7i0ym03f5ian4js99ud4m	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4q1q02bdia40189hgrym	cmpw7i0yx03f8ian4bc7tkn2w	DEANA DEL B. PORNIA	deana del b pornia	\N	UNMATCHED	\N	f
cmpwh4q2402bhia40vdtqwwc6	cmpw7i0zf03fcian48y2jbg5g	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4q2n02blia40th3dyedb	cmpw7i10103fgian4vconqnp2	LEE CHARGE S. CAILING	lee charge s cailing	cmpm70pwb002yiaus2m2fx6w0	MATCHED	\N	t
cmpwh4q2s02bnia404yeflu90	cmpw7i10103fgian4vconqnp2	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4q3902bria400t31jnia	cmpw7i10w03fmian4vlzyfhn1	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4q3o02bvia40wzfr5cnr	cmpw7i11c03fqian4d84v9aa2	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4q3t02bxia40jclp4qps	cmpw7i11c03fqian4d84v9aa2	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4q4c02c1ia40aoxy06p8	cmpw7i12503fwian4jj7azyes	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4q4h02c3ia40bouc0z34	cmpw7i12503fwian4jj7azyes	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4q4m02c5ia40o42wjakb	cmpw7i12503fwian4jj7azyes	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4q5502c9ia40rwuctw4f	cmpw7i13303g4ian4bfl5a769	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4q5k02cdia40qzsagc6t	cmpw7i13h03g8ian4s7ey3clx	JERWIN A. ASIÑERO	jerwin a asiero	cmpm6jzck002siausjij512h3	MATCHED	\N	t
cmpwh4q5p02cfia403ml5cl76	cmpw7i13h03g8ian4s7ey3clx	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4q5u02chia402vf9ko3f	cmpw7i13h03g8ian4s7ey3clx	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4q5y02cjia40bw1kdpr5	cmpw7i13h03g8ian4s7ey3clx	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4q6302clia40p6d2zla5	cmpw7i13h03g8ian4s7ey3clx	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4q6n02cpia40n3bu9zxk	cmpw7i14r03gkian4bsf38jik	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4q6t02cria40uw1llsj3	cmpw7i14r03gkian4bsf38jik	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4q7a02cvia40a74oa2t5	cmpw7i15r03gqian4wei2zfhv	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4q7d02cxia40s2q7ohjt	cmpw7i15r03gqian4wei2zfhv	CATHERINE G. CAWALING	catherine g cawaling	\N	UNMATCHED	\N	f
cmpwh4q7f02czia40ry88tq2m	cmpw7i15r03gqian4wei2zfhv	JOSELINO C. UDAL	joselino c udal	\N	UNMATCHED	\N	f
cmpwh4q7x02d3ia40gw8vbp5b	cmpw7i16e03gyian45dq7binn	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4q8b02d7ia407gcycts8	cmpw7i16x03h2ian4c3tl7j8v	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4q8h02d9ia40rs7nhty6	cmpw7i16x03h2ian4c3tl7j8v	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4q8n02dbia40mzh4p7d1	cmpw7i16x03h2ian4c3tl7j8v	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4q9b02dfia40qx2n0rcd	cmpw7i17w03haian4kuafgxin	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4q9q02djia40y37qt8ld	cmpw7i18e03heian4xm52k1x9	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4qa602dnia40cj0ds8xc	cmpw7i18v03hiian455o3uan7	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4qab02dpia40iw7ar3fn	cmpw7i18v03hiian455o3uan7	MARJUN C. PABAYO	marjun c pabayo	\N	UNMATCHED	\N	f
cmpwh4qad02dria40uckewemc	cmpw7i18v03hiian455o3uan7	MARK RAYMUND T. DEGALA	mark raymund t degala	\N	UNMATCHED	\N	f
cmpwh4qae02dtia406ibm2j7l	cmpw7i18v03hiian455o3uan7	JOEVY PALANJAY	joevy palanjay	\N	UNMATCHED	\N	f
cmpwh4qah02dvia4064pidlam	cmpw7i18v03hiian455o3uan7	RHONA AMOR EIGO	rhona amor eigo	\N	UNMATCHED	\N	f
cmpwh4qaj02dxia40ruzjvj6s	cmpw7i18v03hiian455o3uan7	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4qb302e1ia408nw0m3l5	cmpw7i19w03hwian45fcr5yqv	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4qb902e3ia406u8x0zhb	cmpw7i19w03hwian45fcr5yqv	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4qbf02e5ia40ux73ym6m	cmpw7i19w03hwian45fcr5yqv	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4qbh02e7ia40tf2dbjup	cmpw7i19w03hwian45fcr5yqv	CATHERINE G. CAWALING	catherine g cawaling	\N	UNMATCHED	\N	f
cmpwh4qbx02ebia40nex06myu	cmpw7i1aw03i6ian4x57qeyk4	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4qcg02efia4079znysln	cmpw7i1bg03iaian4f6ng0kh8	MILAN L. GUTAY	milan l gutay	cmpm7q17h003fiausimucssfj	MATCHED	\N	t
cmpwh4qcl02ehia40pl4s1vcv	cmpw7i1bg03iaian4f6ng0kh8	PAULA P. DEDUMO	paula p dedumo	cmpmcwkjj005niausxhpwr0rq	MATCHED	\N	t
cmpwh4qcp02ejia40trxyyz08	cmpw7i1bg03iaian4f6ng0kh8	QUEENIE MARIE B. CASIÑO	queenie marie b casio	cmpmctto9005eiaus7jv5w8sw	MATCHED	\N	t
cmpwh4qcv02elia40elnte9fd	cmpw7i1bg03iaian4f6ng0kh8	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4qdk02eqia404fsgsnyu	cmpw7i1cr03ikian4t9u8z66d	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4qdq02esia402apg2m3v	cmpw7i1cr03ikian4t9u8z66d	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4qdv02euia40d91tbkux	cmpw7i1cr03ikian4t9u8z66d	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4qef02eyia405rvc9jn1	cmpw7i1dr03isian49je2nymr	MARIA GUADA F. DOSDOS	maria guada f dosdos	cmpm7z8kc003xiauswx84u6ek	MATCHED	\N	t
cmpwh4qel02f0ia40vqbq0f8z	cmpw7i1dr03isian49je2nymr	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4qes02f2ia40ebdguzzw	cmpw7i1dr03isian49je2nymr	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4qfc02f6ia40r0sbuj0u	cmpw7i1em03j0ian4gbogbmsw	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4qfq02faia405mj3fegw	cmpw7i1et03j3ian4yfpk81vy	MARIA LIZA M. BIGORNIA (any 11 days)	maria liza m bigornia any days	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4qfx02fcia40oci2y0ma	cmpw7i1et03j3ian4yfpk81vy	ADAMS CHRISTOPHER P. SIOS-E (any 12 days)	adams christopher p siose any days	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4qg202feia40thr1t4r5	cmpw7i1et03j3ian4yfpk81vy	MERLIE T. MONTERA (any 12 days)	merlie t montera any days	cmpm7sv69003oiausjksd398m	MATCHED	\N	t
cmpwh4qgm02fiia40i518cbca	cmpw7i1f503jaian4hdt8q4u7	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4qgr02fkia402neu2g3b	cmpw7i1f503jaian4hdt8q4u7	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4qha02foia40emp0ksji	cmpw7i1fw03jgian4z4en0a17	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4qhf02fqia40izxn2xeg	cmpw7i1fw03jgian4z4en0a17	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4qhk02fsia406arv3gvf	cmpw7i1fw03jgian4z4en0a17	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4qhq02fuia400dkj3m06	cmpw7i1fw03jgian4z4en0a17	CLAUDEVAN A. MACABALE	claudevan a macabale	cmpmaayyh0049iausqyybqoai	MATCHED	\N	t
cmpwh4qhv02fwia4066tjbnyv	cmpw7i1fw03jgian4z4en0a17	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4qif02g0ia40ugv56ns2	cmpw7i1h303jsian4p4cqppe7	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4qiy02g4ia40m3tyw6dt	cmpw7i1hl03jwian4l6pl059v	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4qjf02g8ia40za8brkhc	cmpw7i1i003k0ian4jlhiii4z	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4qju02gcia40ssnrghp2	cmpw7i1ig03k4ian4fccf5uxb	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4qjz02geia40w8nxnw0y	cmpw7i1ig03k4ian4fccf5uxb	MARLON T. GALINDO	marlon t galindo	cmpm7s7j8003liauswjjxk8ex	MATCHED	\N	t
cmpwh4qkt02giia407p4ngoxh	cmpw7i1j703kaian4dpo8li3d	MARCELO E. TOLEDO	marcelo e toledo	\N	UNMATCHED	\N	f
cmpwh4qkx02gkia4011e3a64r	cmpw7i1j703kaian4dpo8li3d	CATHERINE G. CAWALING	catherine g cawaling	\N	UNMATCHED	\N	f
cmpwh4qkz02gmia401b4s1uv5	cmpw7i1j703kaian4dpo8li3d	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4qln02gqia40fphzkgp8	cmpw7i1jv03kiian45g8zuhyf	SHEILA P DEGALA	sheila p degala	cmpmcug27005hiauszp8pd7lt	MATCHED	\N	t
cmpwh4qlr02gsia40j4vkb089	cmpw7i1jv03kiian45g8zuhyf	ANGEL MARIE C. GUILLENA	angel marie c guillena	cmpmcmiud0058iaustuwfw2sp	MATCHED	\N	t
cmpwh4qlw02guia40vam85g2x	cmpw7i1jv03kiian45g8zuhyf	RODELYN E. NAVAROSA	rodelyn e navarosa	cmpmcsydy005biaus8mz8wrn4	MATCHED	\N	t
cmpwh4qmj02gzia40qnrkqpjb	cmpw7i1kr03kqian42m3bhzl9	SHEILA P. DEGALA	sheila p degala	cmpmcug27005hiauszp8pd7lt	MATCHED	\N	t
cmpwh4qmp02h1ia40yot25fgt	cmpw7i1kr03kqian42m3bhzl9	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4qmu02h3ia40vz2qqboh	cmpw7i1kr03kqian42m3bhzl9	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4qnd02h7ia40hbit74di	cmpw7i1ln03kyian4hyi36zv7	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4qni02h9ia40803k7dis	cmpw7i1ln03kyian4hyi36zv7	SHEILA P. DEGALA	sheila p degala	cmpmcug27005hiauszp8pd7lt	MATCHED	\N	t
cmpwh4qo202hdia402uxyxrz0	cmpw7i1me03l4ian4ghvie0oq	LEE CHARGE S. CAILING	lee charge s cailing	cmpm70pwb002yiaus2m2fx6w0	MATCHED	\N	t
cmpwh4qol02hhia40ad8y2v5j	cmpw7i1n203l8ian4yq8cdqgb	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4qp402hlia40sr2pwe98	cmpw7i1nn03lcian4cezhanlc	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4qp802hnia40dscjxwk2	cmpw7i1nn03lcian4cezhanlc	MARLON T. GALINDO	marlon t galindo	cmpm7s7j8003liauswjjxk8ex	MATCHED	\N	t
cmpwh4qpe02hpia40tk6bf67j	cmpw7i1nn03lcian4cezhanlc	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4qq002htia40dwc8fy3b	cmpw7i1ol03lkian4egifa29o	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4qqn02hxia40jx7ndln7	cmpw7i1p803loian4rjrgei6n	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4qsz02idia40swjp8789	cmpw7i1pg03lrian420oy2ayu	DEANA DELL B. PORNIA	deana dell b pornia	cmpm71afq0031iausuxhheoyf	MATCHED	\N	t
cmpwh4qtg02ihia40i3raj0ac	cmpw7i1q003lvian43a0mu9dk	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4qtu02ilia40g4svans1	cmpw7i1qe03lzian4f7tj5cl6	JERWIN A. ASIÑERO	jerwin a asiero	cmpm6jzck002siausjij512h3	MATCHED	\N	t
cmpwh4qtz02inia40vqt3e6rl	cmpw7i1qe03lzian4f7tj5cl6	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4qui02iria40a4g0hy79	cmpw7i1r803m5ian4ld45ihm1	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4qum02itia40bv839tip	cmpw7i1r803m5ian4ld45ihm1	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4qus02ivia408zrdhmf9	cmpw7i1r803m5ian4ld45ihm1	MARCELO E. TOLEDO	marcelo e toledo	\N	UNMATCHED	\N	f
cmpwh4qvd02izia40zal38zpv	cmpw7i1s703mdian4o3tvyz1n	ADAMS CHRISTOPHER P. SIOS-E	adams christopher p siose	cmpm6z80v002viausbcqx3ozw	MATCHED	\N	t
cmpwh4qvj02j1ia40j6gaq0ak	cmpw7i1s703mdian4o3tvyz1n	VEVIEN P. BACULIO	vevien p baculio	cmpm9wtav0040iaus5stdmg52	MATCHED	\N	t
cmpwh4qvp02j3ia40qhymjd91	cmpw7i1s703mdian4o3tvyz1n	CLARISSA L. NICO	clarissa l nico	cmpmcyll0005tiaus9udmpd06	MATCHED	\N	t
cmpwh4qw802j7ia40n5dlkj9t	cmpw7i1t403mlian4vz001zra	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4qwo02jbia40hnqz12qy	cmpw7i1tk03mpian4ue4v4934	GRAD LUCKY MARK N. ARCEGA	grad lucky mark n arcega	cmpm4p7n6001qiausf4s5ahht	MATCHED	\N	t
cmpwh4qx802jfia40xzxmazca	cmpw7i1u603mtian4uxig8hrh	JERWIN A. ASIÑERO	jerwin a asiero	cmpm6jzck002siausjij512h3	MATCHED	\N	t
cmpwh4qxd02jhia40cks19z76	cmpw7i1u603mtian4uxig8hrh	GRAD LUCKY MARK N. ARCEGA	grad lucky mark n arcega	cmpm4p7n6001qiausf4s5ahht	MATCHED	\N	t
cmpwh4qxi02jjia40gvsjxlvh	cmpw7i1u603mtian4uxig8hrh	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4qxo02jlia40jsyz87d5	cmpw7i1u603mtian4uxig8hrh	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4qxs02jnia40pke4sv91	cmpw7i1u603mtian4uxig8hrh	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4qya02jria40zcny12ow	cmpw7i1vp03n5ian4lpr2griy	MARLON T. GALINDO	marlon t galindo	cmpm7s7j8003liauswjjxk8ex	MATCHED	\N	t
cmpwh4qyf02jtia401j3t2n9v	cmpw7i1vp03n5ian4lpr2griy	CORA RAPIRAP	cora rapirap	\N	UNMATCHED	\N	f
cmpwh4qyh02jvia40is67c8fd	cmpw7i1vp03n5ian4lpr2griy	MARY ANN REMOLE	mary ann remole	\N	UNMATCHED	\N	f
cmpwh4qyj02jxia40gye0uge8	cmpw7i1vp03n5ian4lpr2griy	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4qz002k1ia408il3ti37	cmpw7i1wq03nfian4rjbrlr8t	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4qz502k3ia40w0c2guvc	cmpw7i1wq03nfian4rjbrlr8t	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4qza02k5ia409xva3xyy	cmpw7i1wq03nfian4rjbrlr8t	JOSE EDGAR D. ESTRELLA	jose edgar d estrella	cmpm7p9r4003ciausxxtm77m0	MATCHED	\N	t
cmpwh4qzt02k9ia40bh8182s5	cmpw7i1xp03nnian4ub9vokt1	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4qzy02kbia40n7ac02mw	cmpw7i1xp03nnian4ub9vokt1	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4r0302kdia40cvc4cy2u	cmpw7i1xp03nnian4ub9vokt1	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4r0n02khia40ibno684g	cmpw7i1yl03nvian4700ee9nc	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4r0s02kjia40of6m7vnb	cmpw7i1yl03nvian4700ee9nc	JERWIN A. ASIÑERO	jerwin a asiero	cmpm6jzck002siausjij512h3	MATCHED	\N	t
cmpwh4r0y02klia40cm4g86nx	cmpw7i1yl03nvian4700ee9nc	RONEL L. LLAMERA	ronel l llamera	cmpmcv3uk005kiausndde2tr6	MATCHED	\N	t
cmpwh4r1h02kpia40lo8v6hoz	cmpw7i1zf03o3ian4cugxl5kq	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4r1l02kria40iibkvo7w	cmpw7i1zf03o3ian4cugxl5kq	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4r1q02ktia406blbbdd6	cmpw7i1zf03o3ian4cugxl5kq	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4r1t02kvia40c3ksu082	cmpw7i1zf03o3ian4cugxl5kq	MARILYN HALLAZGO	marilyn hallazgo	\N	UNMATCHED	\N	f
cmpwh4r1w02kxia40rkiwrwph	cmpw7i1zf03o3ian4cugxl5kq	GWYNN STEPHANIE SAAVEDRA	gwynn stephanie saavedra	\N	UNMATCHED	\N	f
cmpwh4r1x02kzia40tifvo660	cmpw7i1zf03o3ian4cugxl5kq	CATHERINE G. CAWALING	catherine g cawaling	\N	UNMATCHED	\N	f
cmpwh4r2f02l3ia40zwjaptvm	cmpw7i20i03ohian4qc4dagnl	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4r2j02l5ia40b0c9bwc7	cmpw7i20i03ohian4qc4dagnl	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4r2o02l7ia40bhdp15j5	cmpw7i20i03ohian4qc4dagnl	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4r2u02l9ia40p4k7x0pt	cmpw7i20i03ohian4qc4dagnl	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4r3h02leia40gf30b7ux	cmpw7i21h03orian4dl6q4a3a	MARCELO E. TOLEDO	marcelo e toledo	\N	UNMATCHED	\N	f
cmpwh4r3k02lgia40mnik6lzw	cmpw7i21h03orian4dl6q4a3a	MARK ANTHONY GONZAGA	mark anthony gonzaga	\N	UNMATCHED	\N	f
cmpwh4r3m02liia40zxqnamzf	cmpw7i21h03orian4dl6q4a3a	GWYNN STEPHANIE SAAVEDRA	gwynn stephanie saavedra	\N	UNMATCHED	\N	f
cmpwh4r3o02lkia40k45sh2ch	cmpw7i21h03orian4dl6q4a3a	MARILYN HALLAZGO	marilyn hallazgo	\N	UNMATCHED	\N	f
cmpwh4r3q02lmia40q8b29rx1	cmpw7i21h03orian4dl6q4a3a	CATHERINE G. CAWALING	catherine g cawaling	\N	UNMATCHED	\N	f
cmpwh4r3s02loia40pupr1v6r	cmpw7i21h03orian4dl6q4a3a	SHAINA CLAIRE A. CAGAS	shaina claire a cagas	\N	UNMATCHED	\N	f
cmpwh4r3x02lqia40xq1jpg7s	cmpw7i21h03orian4dl6q4a3a	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4r4g02luia40cldec0rv	cmpw7i22g03p7ian4ewwotkdt	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4r4l02lwia40b5dp7wl4	cmpw7i22g03p7ian4ewwotkdt	SHIELA MAY REGULAR	shiela may regular	\N	UNMATCHED	\N	f
cmpwh4r4n02lyia40wovggc57	cmpw7i22g03p7ian4ewwotkdt	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4r5402m2ia40d2mm931k	cmpw7i23903pfian4krq9md2v	GRAD LUCKY MARK N. ARCEGA	grad lucky mark n arcega	cmpm4p7n6001qiausf4s5ahht	MATCHED	\N	t
cmpwh4r5a02m4ia40im7bkpcn	cmpw7i23903pfian4krq9md2v	BRIAN JAY SACALA	brian jay sacala	cmpmaaekm0046iausrahtxbtp	MATCHED	\N	t
cmpwh4r5f02m6ia40wqxghqhq	cmpw7i23903pfian4krq9md2v	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4r5k02m8ia40ak0hxj7c	cmpw7i23903pfian4krq9md2v	SHIELA MAY D. REGULAR	shiela may d regular	\N	UNMATCHED	\N	f
cmpwh4r5l02maia401s4p1qfm	cmpw7i23903pfian4krq9md2v	GWYNN STEPHANIE SAAVEDRA	gwynn stephanie saavedra	\N	UNMATCHED	\N	f
cmpwh4r5o02mcia40hlsnxad3	cmpw7i23903pfian4krq9md2v	MARILYN HALLAZGO	marilyn hallazgo	\N	UNMATCHED	\N	f
cmpwh4r5q02meia40jmxwu5za	cmpw7i23903pfian4krq9md2v	JOSE EDGAR D. ESTRELLA	jose edgar d estrella	cmpm7p9r4003ciausxxtm77m0	MATCHED	\N	t
cmpwh4r6802miia402fdc90zr	cmpw7i24l03pvian4fk7d137d	BRIAN JAY SACALA	brian jay sacala	cmpmaaekm0046iausrahtxbtp	MATCHED	\N	t
cmpwh4r6d02mkia40323p89wf	cmpw7i24l03pvian4fk7d137d	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4r6h02mmia405bw22484	cmpw7i24l03pvian4fk7d137d	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4r7002mqia40vyho2a21	cmpw7i25k03q3ian4a1mupl40	VEVIEN P. BACULIO	vevien p baculio	cmpm9wtav0040iaus5stdmg52	MATCHED	\N	t
cmpwh4r7p02mvia40w0s35zlu	cmpw7i26603q7ian4tzdg5src	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4r7w02mxia40na8r4col	cmpw7i26603q7ian4tzdg5src	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4r8g02n1ia40fx0qaghj	cmpw7i27003qdian4e0twif1f	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4r8l02n3ia402f9yds91	cmpw7i27003qdian4e0twif1f	MARCELO E. TOLEDO JR.	marcelo e toledo jr	\N	UNMATCHED	\N	f
cmpwh4r8n02n5ia40gk1ckmw2	cmpw7i27003qdian4e0twif1f	MARK ANTHONY GONZAGA	mark anthony gonzaga	\N	UNMATCHED	\N	f
cmpwh4r8p02n7ia40goxxrheq	cmpw7i27003qdian4e0twif1f	SHAINA CLAIRE A. CAGAS	shaina claire a cagas	\N	UNMATCHED	\N	f
cmpwh4r9502nbia402l5kivcb	cmpw7i27w03qnian43n95w895	MAY T. DUBLIN	may t dublin	cmpm7y2d5003uiaushuvnjj0w	MATCHED	\N	t
cmpwh4r9m02nfia40agofhzh0	cmpw7i28f03qrian4v8k0y0xl	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4ra402njia40liv3h6ne	cmpw7i28z03qvian4e94g5i49	BRIAN JAY SACALA	brian jay sacala	cmpmaaekm0046iausrahtxbtp	MATCHED	\N	t
cmpwh4ra902nlia40bo816bgv	cmpw7i28z03qvian4e94g5i49	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4rae02nnia40edlqrnjl	cmpw7i28z03qvian4e94g5i49	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4rax02nria405z8a59eo	cmpw7i29s03r3ian4kmlmibxc	BRIAN JAY SACALA	brian jay sacala	cmpmaaekm0046iausrahtxbtp	MATCHED	\N	t
cmpwh4rb102ntia40ddz1ua7j	cmpw7i29s03r3ian4kmlmibxc	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4rb602nvia4047nzwuka	cmpw7i29s03r3ian4kmlmibxc	SHIELA MAY D. REGULAR	shiela may d regular	\N	UNMATCHED	\N	f
cmpwh4rbo02nzia400wxi1747	cmpw7i2an03rbian4ojj7qu2y	BRIAN JAY SACALA	brian jay sacala	cmpmaaekm0046iausrahtxbtp	MATCHED	\N	t
cmpwh4rbs02o1ia40mcxxsumo	cmpw7i2an03rbian4ojj7qu2y	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4rcc02o5ia4086kulyx0	cmpw7i2bi03rhian4pyp06vfk	SHEILA P. DE GALA	sheila p de gala	\N	UNMATCHED	\N	f
cmpwh4rce02o7ia40xmbyvw7y	cmpw7i2bi03rhian4pyp06vfk	ANGEL MARIE C. GUILLENA	angel marie c guillena	cmpmcmiud0058iaustuwfw2sp	MATCHED	\N	t
cmpwh4rcj02o9ia40umxd1xfa	cmpw7i2bi03rhian4pyp06vfk	RODELYN E. NAVAROSA	rodelyn e navarosa	cmpmcsydy005biaus8mz8wrn4	MATCHED	\N	t
cmpwh4rd902oeia40vgjwa768	cmpw7i2ch03rpian4n31k5sz7	SHEILA P. DE GALA	sheila p de gala	\N	UNMATCHED	\N	f
cmpwh4rdb02ogia40fwr84bk8	cmpw7i2ch03rpian4n31k5sz7	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4rdg02oiia40pzz3m4hw	cmpw7i2ch03rpian4n31k5sz7	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4rdz02omia4007itehil	cmpw7i2dd03rxian4rp032bws	AARON ALLEN E. CAINGLET	aaron allen e cainglet	cmpm7rduc003iiausmprulwf1	MATCHED	\N	t
cmpwh4re302ooia40k1653aqt	cmpw7i2dd03rxian4rp032bws	SHEILA P. DEGALA	sheila p degala	cmpmcug27005hiauszp8pd7lt	MATCHED	\N	t
cmpwh4reo02osia409q8wzrfd	cmpw7i2e603s3ian4lmyptbmz	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4rf202owia40zm0tc1yu	cmpw7i2ek03s7ian4bo88n50n	MARIA LIZA M. BIGORNIA	maria liza m bigornia	cmpm6ioph002niausbtnw8zo3	MATCHED	\N	t
cmpwh4rf802oyia40yigaflfm	cmpw7i2ek03s7ian4bo88n50n	MARIVIC R. ESCOBIDO	marivic r escobido	cmpm7nh3s0036iausxm44cu9t	MATCHED	\N	t
cmpwh4rfd02p0ia40ddc0dc0j	cmpw7i2ek03s7ian4bo88n50n	GRAD LUCKY MARK N. ARCEGA	grad lucky mark n arcega	cmpm4p7n6001qiausf4s5ahht	MATCHED	\N	t
cmpwh4rfh02p2ia40vgai2bc4	cmpw7i2ek03s7ian4bo88n50n	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4rfm02p4ia40dmodcbta	cmpw7i2ek03s7ian4bo88n50n	WED MICOLE B. QUILANG	wed micole b quilang	cmpmajetn004iiaus2vel52gz	MATCHED	\N	t
cmpwh4rfr02p6ia4095tlc3f0	cmpw7i2ek03s7ian4bo88n50n	ROEL COGALITO	roel cogalito	\N	UNMATCHED	\N	f
cmpwh4rg702paia40om1a4ouz	cmpw7i2fx03slian4dk5nle20	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4rgm02peia40dungulon	cmpw7i2gc03spian4274f341t	BRIAN JAY SACALA	brian jay sacala	cmpmaaekm0046iausrahtxbtp	MATCHED	\N	t
cmpwh4rgs02pgia403x1jn3op	cmpw7i2gc03spian4274f341t	EDWIN D. MEÑOZA	edwin d meoza	cmpmcxxg5005qiausn9g2slk7	MATCHED	\N	t
cmpwh4rgx02piia404y3y5bwk	cmpw7i2gc03spian4274f341t	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4rhg02pmia40focx0lb9	cmpw7i2he03sxian4mqekmt7m	MILAN L. GUTAY	milan l gutay	cmpm7q17h003fiausimucssfj	MATCHED	\N	t
cmpwh4rhm02poia40818h1d41	cmpw7i2he03sxian4mqekmt7m	PAULA P. DEDUMO	paula p dedumo	cmpmcwkjj005niausxhpwr0rq	MATCHED	\N	t
cmpwh4rhq02pqia40791m27jn	cmpw7i2he03sxian4mqekmt7m	HECTOR B. PAYLANGCO	hector b paylangco	cmpmamcwq004viaus5y4atq5q	MATCHED	\N	t
cmpwh4ria02puia40wu1oguxi	cmpw7i2ic03t5ian4hjno6inz	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4rio02pyia4017qvaa2v	cmpw7i2iu03t9ian4qx3az7lo	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4rj902q2ia403eggp7ni	cmpw7i2jc03tdian4zwbuyd5t	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4rjs02q6ia40nugo79nh	cmpwh4rjn02q4ia402uoak26n	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	ALL CONCERNED PSA MISAMIS ORIENTAL OFFICIALS AND PERSONNEL	\N	CUSTOM	\N	f
cmpwh4rk702qaia403f3mjvy6	cmpw7i2k703tlian4wgl1oniz	LEE CHARGE S. CAILING	lee charge s cailing	cmpm70pwb002yiaus2m2fx6w0	MATCHED	\N	t
cmpwh4rkq02qeia40uv4mix6q	cmpw7i2ks03tpian4je56mi8u	JOY L. DELOS SANTOS	joy l delos santos	\N	UNMATCHED	\N	f
cmpwh4rks02qgia40uiqvszhd	cmpw7i2ks03tpian4je56mi8u	CHRISTIAN JEN D. LABADO	christian jen d labado	cmpmbbun40051iaus0ypzmgo0	MATCHED	\N	t
cmpwh4rkw02qiia4028li8r3h	cmpw7i2ks03tpian4je56mi8u	MARCELO E. TOLEDO	marcelo e toledo	\N	UNMATCHED	\N	f
cmpwh4rky02qkia40149u6sf5	cmpw7i2ks03tpian4je56mi8u	MARK ANTHONY GONZAGA	mark anthony gonzaga	\N	UNMATCHED	\N	f
cmpwh4rl002qmia40y8mqqkbt	cmpw7i2ks03tpian4je56mi8u	SHAINA CLAIRE A. CAGAS	shaina claire a cagas	\N	UNMATCHED	\N	f
cmpwh4rl202qoia40er7mjipk	cmpw7i2ks03tpian4je56mi8u	JOSELINDO C. UDAL	joselindo c udal	cmpmalk2l004qiausp3pm1z6f	MATCHED	\N	t
cmpwh4rlm02qsia405nxl6ry1	cmpw7i2lt03u3ian44zx1bv02	GRAD LUCKY MARK N. ARCEGA	grad lucky mark n arcega	cmpm4p7n6001qiausf4s5ahht	MATCHED	\N	t
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, username, email, "mustChangePassword", "passwordHash", role, "personnelId", "employeeId", section, "isActive", "lastLoginAt", "createdAt", "updatedAt", "photoUrl") FROM stdin;
cmprou6bt000qiar8b0qy9g69	Brian Jay Sacala	b.sacala	b.sacala@psa.gov.ph	t	$2b$12$AzUWkmXfl3mhPApJT.PbQure0GDYRAscAfcOuh9/lFYDSK.7MgW1i	ADMIN	cmpmaaekm0046iausrahtxbtp	PSA1043-020	Statistical Operations	t	\N	2026-05-30 01:44:33.929	2026-05-30 01:44:33.929	\N
cmprouhzl000uiar82bggsy0u	Catherine Mae G. Chin	c.chin	\N	t	$2b$12$oxFPrwrQ8Uq0USJ0PK7Jqu7mYW1pmK2z02L1NsyZLoN3hw.njW/pG	EMPLOYEE	cmpmczbk0005wiausmycr3jbp	PSA1043-038	Civil Registration and Vital Statistics	t	\N	2026-05-30 01:44:49.041	2026-05-30 01:44:49.041	\N
cmprous7a000yiar8nmv94emc	Cherry May C. Parajis	c.parajis	\N	t	$2b$12$u5awBYQA78FUvC1iwhY3EOZG4fVnILXKepF6Kv/indy0hL13oZbHO	EMPLOYEE	cmpmain42004fiaus2twkusb1	PSA1043-023	Civil Registration and Vital Statistics	t	\N	2026-05-30 01:45:02.279	2026-05-30 01:45:02.279	\N
cmprovhem0012iar8l6oo5zi0	Christian Jen Labado	c.labado	c.labado.psa@gmail.com	t	$2b$12$dWZ6MsXtOdlXTH3/ZuLt7.6sm.la/5FFPNeFeDoU/7k53A4F6nUvq	EMPLOYEE	cmpmbbun40051iaus0ypzmgo0	PSA1043-029	Philippine Identification System	t	\N	2026-05-30 01:45:34.943	2026-05-30 01:45:34.943	\N
cmpm4x3su001uiausw8pb2snz	Grad Lucky Mark N. Arcega	g.arcega	g.arcega.psa@gmail.com	t	$2b$12$tg68N747G80E8E1UbQvo8e5FmL5g9NjPMLDCxpSN1QrNcEaWNZ5zK	ADMIN	cmpm4p7n6001qiausf4s5ahht	PSA1043-011	Statistical Operations	t	2026-05-26 05:03:45.309	2026-05-26 04:28:07.423	2026-05-26 05:03:45.312	\N
cmprovsp70016iar8t0atnzdo	Cindy B. Dumaloan	c.dumaloan	\N	t	$2b$12$hqZeyN0I/evpnwmPrGuxG.X1C2aKnbPAGSTnHaIPaoOdGSgn4LTzq	EMPLOYEE	cmpm7wjyu003riaus32ihl37b	PSA1043-015	Civil Registration and Vital Statistics	t	\N	2026-05-30 01:45:49.579	2026-05-30 01:45:49.579	\N
cmprow0tb001aiar8l2pxxy5s	Clarissa L. Nico	c.nico	c.nico.psa@gmail.com	t	$2b$12$buz0bAVrT.gCYeuP7TiKVuxKvIFyKeENcQtrtOFYXxPxNU3QJFrL.	EMPLOYEE	cmpmcyll0005tiaus9udmpd06	PSA1043-037	Statistical Operations	t	\N	2026-05-30 01:46:00.095	2026-05-30 01:46:00.095	\N
cmprowfas001eiar8lrsazwik	Deana Dell B. Pornia	d.pornia	d.pornia@psa.gov.ph	t	$2b$12$51qnuratuhJ8boAv8riZde0VboQylFrNH4vXe1OZlFQQ6cuqSwY4W	EMPLOYEE	cmpm71afq0031iausuxhheoyf	PSA1043-005	Statistical Operations	t	\N	2026-05-30 01:46:18.868	2026-05-30 01:46:18.868	\N
cmprowo9l001iiar8cij3h5w5	Edwin D. Meñoza	e.menoza	e.menoza.psa@gmail.com	t	$2b$12$NoICfNexw7/vmoP/uQg7quyNbz92i96poqXr5l/65vy8aU9ydWweS	EMPLOYEE	cmpmcxxg5005qiausn9g2slk7	PSA1043-036	Statistical Operations	t	\N	2026-05-30 01:46:30.489	2026-05-30 01:46:30.489	\N
cmprowub5001miar89qh70ser	Glenda C. Bazar	g.bazar	g.bazar@psa.gov.ph	t	$2b$12$rHvjBigngLhC738Ef8SLm.L8EROBHsrffvqfgbcRLlaElC1Tdvbui	EMPLOYEE	cmpma9o460043iausnsgkdz9b	PSA1043-019	Administrative and Accounting	t	\N	2026-05-30 01:46:38.321	2026-05-30 01:46:38.321	\N
cmproyjxc001wiar8nok429s7	Jemima P. Gutoc	j.gutoc	j.gutoc@psa.gov.pph	t	$2b$12$Vk27E1lw6LDPnwS6s.DS8.FZl9Ej/GLrwLYa1A4FqngIvhzTzYCE6	EMPLOYEE	cmpm7nzmm0039iauss19l621g	PSA1043-007	Administrative and Accounting	t	\N	2026-05-30 01:47:58.176	2026-05-30 01:47:58.176	\N
cmproyynl0020iar8xeh4tvgk	Jerwin A. Asiñero	j.asinero	j.asinero@psa.gov.ph	t	$2b$12$9fM/ovvO.9LQmrnQ1Y7O5OOykkHFYGyBNJw3NwiruWH0zGAce.wyq	EMPLOYEE	cmpm6jzck002siausjij512h3	PSA1043-002	Statistical Operations	t	\N	2026-05-30 01:48:17.265	2026-05-30 01:48:17.265	\N
cmpp8oomc0001iap44h6gpnob	Angel Marie Guillena	a.guillena	\N	f	$2b$12$pnTp72U0aUhkUBcejOvcKOWUiCzspUoadTw/x5cXQmL9Q01KbkRiC	ADMIN	cmpmcmiud0058iaustuwfw2sp	PSA1043-030	Administrative and Accounting	t	2026-05-28 08:59:45.305	2026-05-28 08:36:51.492	2026-05-28 09:01:24.017	\N
cmprozcnh0024iar82a7i93si	Jose Edgar D. Estrella	j.estrella	j.estrella@psa.gov.ph	t	$2b$12$.IuCB3PDoC.0TukBhpEJ6enSR69KD1lFtHBdnC5KfN4aYgwUkOls6	EMPLOYEE	cmpm7p9r4003ciausxxtm77m0	PSA1043-009	Administrative and Accounting	t	\N	2026-05-30 01:48:35.405	2026-05-30 01:48:35.405	\N
cmprozk560028iar8p2tu3at3	Joselindo C. Udal	j.udal	\N	t	$2b$12$Z0PrjPA2WeR2X4ntHf1BMuP0MudoQh3ik7D/A61BEX1MXIKTkj1he	VIEWER	cmpmalk2l004qiausp3pm1z6f	PSA1043-026	Philippine Identification System	t	\N	2026-05-30 01:48:45.114	2026-05-30 01:48:49.504	\N
cmprozzp6002eiar851ke8jhc	Kathleen Marie P. Medel	k.medel	k.medel.psa@gmail.com	t	$2b$12$IvcKlFccwOYF9.05xmnlEOztKcrjxpmIsg4lcXGPZujRVsEMKnXUW	EMPLOYEE	cmpmakc8i004liaus6oylw747	PSA1043-025	Statistical Operations	t	\N	2026-05-30 01:49:05.274	2026-05-30 01:49:05.274	\N
cmprp1pt3002iiar82g2ry8sv	Kimberly F. Esmeralda	k.esmeralda	\N	t	$2b$12$pL0NTuUlQV6KqstPw/fHpOUpHtM9dW4gS91A5KACPfEbcFlQhwzwW	EMPLOYEE	cmpmackhz004ciausks7jgn0o	PSA1043-022	Civil Registration and Vital Statistics	t	\N	2026-05-30 01:50:25.767	2026-05-30 01:50:25.767	\N
cmprp48m1003eiar8xwdzkna0	Paula P. Dedumo	p.dedumo	pp.dedumo.psa@gmail.com	t	$2b$12$F3JQ17v2VbbR7p252o9./.lFcTv4x5If8o0Kkgqbgy1NPbxZgg.cO	EMPLOYEE	cmpmcwkjj005niausxhpwr0rq	PSA1043-035	Statistical Operations	t	\N	2026-05-30 01:52:23.449	2026-07-01 00:33:20.768	\N
cmprot6zi000eiar893u9plbx	Milan L. Gutay	m.gutay	m.gutay@psa.gov.ph	t	$2b$12$MdRBQDft7a5fpEEG392k9uXluKeyqqWUX7MOFUrLMX9ZMIBQnTobm	EMPLOYEE	cmpm7q17h003fiausimucssfj	PSA1043-010	Statistical Operations	t	\N	2026-05-30 01:43:48.126	2026-05-30 01:43:48.126	\N
cmprotgjx000iiar8nvk7aldv	Aaron Allen E. Cainglet	a.cainglet	a.cainglet@psa.gov.ph	t	$2b$12$Q0MR5nZA6.oJFZbcCsuLYe8ASEeabwbNLqvtWIXVMEBxjgwvF9yZK	EMPLOYEE	cmpm7rduc003iiausmprulwf1	PSA1043-012	Statistical Operations	t	\N	2026-05-30 01:44:00.525	2026-05-30 01:44:00.525	\N
cmprotqbi000miar8oowhzmar	Adams Christopher P. Sios-e	a.siose	a.siose@psa.gov.ph	t	$2b$12$MAtg46.e5ClsarvHQ8U6hu.zSY5.zI7M4XuuLQ4bdvNnZIcbjOIBe	EMPLOYEE	cmpm6z80v002viausbcqx3ozw	PSA1043-003	Statistical Operations	t	\N	2026-05-30 01:44:13.182	2026-05-30 01:44:13.182	\N
cmprp1zmr002miar8epjep3s0	Lee Charge S. Cailing	l.cailing	l.cailing@psa.gov.ph	t	$2b$12$VwdYgRjxrPGUrUnl.7Ckse3DdVv2piOQxioETN.iWRyiAnGL8ev7i	EMPLOYEE	cmpm70pwb002yiaus2m2fx6w0	PSA1043-004	Statistical Operations	t	\N	2026-05-30 01:50:38.499	2026-05-30 01:50:38.499	\N
cmprp29ex002qiar8a5ddgo68	Maria Guada F. Dosdos	m.dosdos	m.flores@psa.gov.ph	t	$2b$12$tnK0GaEG.C.9Nma82e1T4O/SbhLa9pmRpPvLnTjRLJEX594/EYG/C	EMPLOYEE	cmpm7z8kc003xiauswx84u6ek	PSA1043-017	Administrative and Accounting	t	\N	2026-05-30 01:50:51.177	2026-05-30 01:50:51.177	\N
cmprp2gyg002uiar8yfy3qfrc	Maria Liza M. Bigornia	m.bigornia	l.bigornia@psa.gov.ph	t	$2b$12$nFS2JugWwRTf4/tUVvT8BecKjd0/Jfhw1qotnG5LnUG1alfxzw3k2	SUPERVISOR	cmpm6ioph002niausbtnw8zo3	PSA1043-001	Head of Office	t	\N	2026-05-30 01:51:00.952	2026-05-30 01:51:00.952	\N
cmprp2te8002yiar8ojq52zwk	Marivic R. Escobido	m.escobido	m.escobido@psa.gov.ph	t	$2b$12$37m6N2sJFc1AmxQvE3wa1.bmG8Zw1k3oEvhpYEQ0djeZjbr5Xp/u6	EMPLOYEE	cmpm7nh3s0036iausxm44cu9t	PSA1043-006	Civil Registration and Vital Statistics	t	\N	2026-05-30 01:51:17.072	2026-05-30 01:51:17.072	\N
cmprp32yp0032iar83wks68fy	Marlon T. Galindo	m.galindo	m.galindo@psa.gov.ph	t	$2b$12$MQRXQqST.U19qy8Z31CcHu35xET/O4.IoC0AiLCXlp.XgMU0nraY2	EMPLOYEE	cmpm7s7j8003liauswjjxk8ex	PSA1043-013	Statistical Operations	t	\N	2026-05-30 01:51:29.473	2026-05-30 01:51:29.473	\N
cmprp3gz70036iar80eg0zh3i	May T. Dublin	m.dublin	m.dublin@psa.gov.ph	t	$2b$12$ib/hVrMycG/82HspHbeBLeCAqR8jUOjqJtCkoPx2V..cEvuATsvl6	EMPLOYEE	cmpm7y2d5003uiaushuvnjj0w	PSA1043-016	Civil Registration and Vital Statistics	t	\N	2026-05-30 01:51:47.635	2026-05-30 01:51:47.635	\N
cmprp40vo003aiar8forj6vpj	Merlie T. Montera	m.montera	m.montera@psa.gov.ph	t	$2b$12$l5OsWkBBFXPDev28F0vDVuwXeeGt0WDRjtyWXYPPy0laEbEJtOBJW	EMPLOYEE	cmpm7sv69003oiausjksd398m	PSA1043-014	Statistical Operations	t	\N	2026-05-30 01:52:13.428	2026-05-30 01:52:13.428	\N
cmproy6y8001siar8a50hg49k	Hector B. Paylangco	h.paylangco	paylangcohector@gmail.com	t	$2b$12$ivNMAnhsKs4LxKRZqLbSeOK.uP8rWmjpAyG5fNqL30IH.v8GCA382	VIEWER	cmpmamcwq004viaus5y4atq5q	PSA1043-027	Administrative and Accounting	t	\N	2026-05-30 01:47:41.36	2026-07-01 00:34:02.292	\N
cmprp4ix5003iiar8v8fxuweo	Queenie Marie B. Casiño	q.casino	q.casino.psa@gmail.com	t	$2b$12$xrP0leYUwoRBDeC3bm.5GO2fdTtEJaVBbaB1UCPx8AxTXm6/jZ99W	EMPLOYEE	cmpmctto9005eiaus7jv5w8sw	PSA1043-032	Statistical Operations	t	\N	2026-05-30 01:52:36.809	2026-05-30 01:52:36.809	\N
cmprp531i003miar8ydi9ceuc	Rodelyn Navarosa	r.navarosa	r.navarosa.psa@gmail.com	t	$2b$12$IfYuEpKl0eXSNSsqmXQHR.8nsBE5PpVCFOLJ1UptbzfwWaMdjUKBe	EMPLOYEE	cmpmcsydy005biaus8mz8wrn4	PSA1043-031	Statistical Operations	t	\N	2026-05-30 01:53:02.887	2026-05-30 01:53:02.887	\N
cmprp5d5m003qiar8ufiurlvm	Ronel L. Llamera	r.llamera	r.llamera.psa@gmail.com	t	$2b$12$jGK.tfbcfIFYKUmtb6ZEluTx6H9UD8cBx1HFKm1kpxdv2xwlv0SM6	EMPLOYEE	cmpmcv3uk005kiausndde2tr6	PSA1043-034	Statistical Operations	t	\N	2026-05-30 01:53:15.994	2026-05-30 01:53:15.994	\N
cmprp5sal003yiar8kj0bc755	Sheila P. Degala	s.degala	s.degala.psa@gmail.com	t	$2b$12$odTqXBAKkeWXkyFmpsqkzeQUXanB6UPzwOo2tyLar0PeW6E9/qNqC	EMPLOYEE	cmpmcug27005hiauszp8pd7lt	PSA1043-033	Statistical Operations	t	\N	2026-05-30 01:53:35.613	2026-05-30 01:53:35.613	\N
cmprp60ad0042iar8ugzse0q9	Vevien P. Baculio	v.baculio	v.baculio@psa.gov.ph	t	$2b$12$g.WeaYOd7wBqnscDJQygqOUuEa6leJujsOh3Q.xc0EtbNFDcZbCf2	EMPLOYEE	cmpm9wtav0040iaus5stdmg52	PSA1043-018	Administrative and Accounting	t	\N	2026-05-30 01:53:45.973	2026-05-30 01:53:45.973	\N
cmprp6lub0046iar82h4r5fql	Wed Micole B. Quilang	w.quilang	w.quilang.psa@gmail.com	t	$2b$12$QXE8hRHTvle9FWbDrXmxhut/ceKsGMyd61acxsq.Qd20wjKxGuDSG	EMPLOYEE	cmpmajetn004iiaus2vel52gz	PSA1043-024	Civil Registration and Vital Statistics	t	\N	2026-05-30 01:54:13.907	2026-05-30 01:54:13.907	\N
cmpp3gnhz0007iafkfwlwufi4	Claudevan A. Macabale	c.macabale	c.macabale.psa@gmail.com	f	$2b$12$0mlQpr6JFQ3914xytXIiG.xvoXMDJigTQyafLxMju0nAO/xMpzTA2	EMPLOYEE	cmpmaayyh0049iausqyybqoai	PSA1043-021	Philippine Identification System	t	2026-06-03 12:11:11.018	2026-05-28 06:10:38.712	2026-06-03 12:11:11.021	\N
cmplkm5x70000iaeg6ej70tgq	S-Rank Admin-kun	superadmin	claudevanmacabale@gmail.com	f	$2b$12$ncXrrKP3d8dH2b7V8.hzwOdGcL18X3B0aOELiFXCu09DWlDT3H6kC	SUPER_ADMIN	\N	\N	\N	t	2026-06-10 09:32:51.271	2026-05-25 18:59:44.635	2026-06-10 09:32:51.273	/uploads/profiles/admin-cmplkm5x70000iaeg6ej70tgq-1780455756927.png
cmprp5k9u003uiar8cjpe7aec	Sheila May D. Regular	s.regular	sh.regular.psa@gmail.com	t	$2b$12$b/S1UHjOqFNSAuWJG1znVOV868gh5mUnR6XD02OwAuXjr0wMylb82	EMPLOYEE	cmpmd0y8g005ziausnc38ns1g	PSA1043-039	Statistical Operations	t	\N	2026-05-30 01:53:25.219	2026-07-01 00:33:33.575	\N
\.


--
-- Data for Name: Vehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vehicle" (id, name, "plateNumber", description, "isActive", "createdAt", "updatedAt") FROM stdin;
cmpoxvf6h0004ia9wc2ulotr3	Toyota HiAce	SNA-9905	Van	t	2026-05-28 03:34:10.073	2026-05-28 03:34:10.073
cmpoxwo6x0007ia9w60idkoqx	Isuzu D-Max	SAB-6469	Pickup Truck	t	2026-05-28 03:35:08.41	2026-05-28 03:35:08.41
\.


--
-- Data for Name: VehicleRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VehicleRequest" (id, "requesterPersonnelId", "requestedByUserId", "travelDate", "departureAt", "expectedReturnAt", purpose, destination, status, "assignedVehicleId", "adminNotes", "rejectionReason", "reviewedById", "calendarActivityId", "createdAt", "updatedAt", "soFileUrl", "soNumber") FROM stdin;
cmpp3m0ca000jiafkq1g0p7y3	cmpmaayyh0049iausqyybqoai	cmpp3gnhz0007iafkfwlwufi4	2026-06-09 16:00:00	\N	\N	Supervision	Gingoog City	APPROVED	cmpoxwo6x0007ia9w60idkoqx	\N	\N	cmplkm5x70000iaeg6ej70tgq	cmpp3p9u1000tiafk8s75f91j	2026-05-28 06:14:48.635	2026-05-28 06:17:20.918	\N	\N
cmpy9rbat00b7iaecdd6xlwz4	cmpmaayyh0049iausqyybqoai	cmpp3gnhz0007iafkfwlwufi4	2026-06-04 16:00:00	2026-06-04 22:00:00	2026-06-05 09:00:00	Supervisionaryefewgtrwk;gkrwgk;tkg;2g;2;gdgdegf	Sugbongcogon, Misamis Oriental, Talisayan, Misamis Oriental, Magsaysay, Misamis Oreintal	APPROVED	cmpoxwo6x0007ia9w60idkoqx	\N	\N	cmplkm5x70000iaeg6ej70tgq	cmpyao7zo0001ia20f2sbahs0	2026-06-03 16:16:49.397	2026-06-03 16:42:24.767	\N	\N
cmpyaoujo0008ia20ealxdgtc	cmpmaayyh0049iausqyybqoai	cmpp3gnhz0007iafkfwlwufi4	2026-06-09 16:00:00	2026-06-09 16:42:00	2026-06-10 00:42:00	test	etetetetette	APPROVED	cmpoxvf6h0004ia9wc2ulotr3	\N	\N	cmplkm5x70000iaeg6ej70tgq	cmpyawagj001hia20k0ecp451	2026-06-03 16:42:53.988	2026-06-03 16:48:41.211	\N	\N
cmpyawy4b001qia20ts4s8t84	cmpmaayyh0049iausqyybqoai	cmpp3gnhz0007iafkfwlwufi4	2026-06-09 16:00:00	2026-06-09 17:48:00	2026-06-10 07:48:00	htrhtr	etetetetette	REJECTED	\N	\N	wlay sakyanan	cmplkm5x70000iaeg6ej70tgq	\N	2026-06-03 16:49:11.867	2026-06-03 17:12:32.293	\N	\N
\.


--
-- Data for Name: VehicleRequestPassenger; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VehicleRequestPassenger" (id, "requestId", "personnelId", "createdAt") FROM stdin;
cmpp3m0cb000liafkmg2pz7xe	cmpp3m0ca000jiafkq1g0p7y3	cmpmajetn004iiaus2vel52gz	2026-05-28 06:14:48.635
cmpy9rbat00b9iaecbl83jo4d	cmpy9rbat00b7iaecdd6xlwz4	cmpm7rduc003iiausmprulwf1	2026-06-03 16:16:49.397
cmpy9rbat00baiaecctxc8byq	cmpy9rbat00b7iaecdd6xlwz4	cmpm6z80v002viausbcqx3ozw	2026-06-03 16:16:49.397
cmpy9rbat00bbiaecinwmwvaf	cmpy9rbat00b7iaecdd6xlwz4	cmpmcmiud0058iaustuwfw2sp	2026-06-03 16:16:49.397
cmpy9rbat00bciaecg2xoiawu	cmpy9rbat00b7iaecdd6xlwz4	cmpmaaekm0046iausrahtxbtp	2026-06-03 16:16:49.397
cmpy9rbat00bdiaecr99phs52	cmpy9rbat00b7iaecdd6xlwz4	cmpmczbk0005wiausmycr3jbp	2026-06-03 16:16:49.397
cmpy9rbat00beiaecgovb5ykd	cmpy9rbat00b7iaecdd6xlwz4	cmpmain42004fiaus2twkusb1	2026-06-03 16:16:49.397
cmpy9rbat00bfiaecsqusxra3	cmpy9rbat00b7iaecdd6xlwz4	cmpmanuku004yiaush28acnzm	2026-06-03 16:16:49.397
cmpy9rbat00bgiaecaamuk713	cmpy9rbat00b7iaecdd6xlwz4	cmpmbbun40051iaus0ypzmgo0	2026-06-03 16:16:49.397
cmpyaoujo000aia20qc1qp5mz	cmpyaoujo0008ia20ealxdgtc	cmpm7rduc003iiausmprulwf1	2026-06-03 16:42:53.988
\.


--
-- Data for Name: _ActivityInvolvedPersonnel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ActivityInvolvedPersonnel" ("A", "B") FROM stdin;
cmpp3p9u1000tiafk8s75f91j	cmpmajetn004iiaus2vel52gz
cmpwhc10902qvia40u46l30gp	cmpm7rduc003iiausmprulwf1
cmpyao7zo0001ia20f2sbahs0	cmpmaaekm0046iausrahtxbtp
cmpyao7zo0001ia20f2sbahs0	cmpmczbk0005wiausmycr3jbp
cmpyao7zo0001ia20f2sbahs0	cmpmain42004fiaus2twkusb1
cmpyao7zo0001ia20f2sbahs0	cmpmbbun40051iaus0ypzmgo0
cmpyao7zo0001ia20f2sbahs0	cmpmanuku004yiaush28acnzm
cmpyao7zo0001ia20f2sbahs0	cmpm7rduc003iiausmprulwf1
cmpyao7zo0001ia20f2sbahs0	cmpm6z80v002viausbcqx3ozw
cmpyao7zo0001ia20f2sbahs0	cmpmcmiud0058iaustuwfw2sp
cmpyawagj001hia20k0ecp451	cmpm7rduc003iiausmprulwf1
cmpwh4mla01djia40atwh8mb3	cmpm71afq0031iausuxhheoyf
cmpwh4mml01dria40o2rdusgs	cmpmamcwq004viaus5y4atq5q
cmpwh4mml01dria40o2rdusgs	cmpm7nh3s0036iausxm44cu9t
cmpwh4mml01dria40o2rdusgs	cmpm7y2d5003uiaushuvnjj0w
cmpwh4mo401e1ia4067em941s	cmpmamcwq004viaus5y4atq5q
cmpwh4mo401e1ia4067em941s	cmpm6ioph002niausbtnw8zo3
cmpwh4mo401e1ia4067em941s	cmpm7nh3s0036iausxm44cu9t
cmpwh4mo401e1ia4067em941s	cmpm7wjyu003riaus32ihl37b
cmpwh4mp201e5ia40n5582fci	cmpm71afq0031iausuxhheoyf
cmpwh4mq801edia40s0h2ays7	cmpmamcwq004viaus5y4atq5q
cmpwh4mq801edia40s0h2ays7	cmpm7nh3s0036iausxm44cu9t
cmpwh4mq801edia40s0h2ays7	cmpm7y2d5003uiaushuvnjj0w
cmpwh4mqy01ehia40vfhh9kyj	cmpm7y2d5003uiaushuvnjj0w
cmpwh4mrm01elia40k3iareiu	cmpm71afq0031iausuxhheoyf
cmpwh4msg01eria40cidbaf5d	cmpmamcwq004viaus5y4atq5q
cmpwh4msg01eria40cidbaf5d	cmpm71afq0031iausuxhheoyf
cmpwh4mt801exia405wfdsnsn	cmpm9wtav0040iaus5stdmg52
cmpwh4mug01f7ia40k8xjt7zh	cmpm6ioph002niausbtnw8zo3
cmpwh4mug01f7ia40k8xjt7zh	cmpmalk2l004qiausp3pm1z6f
cmpwh4mug01f7ia40k8xjt7zh	cmpmamcwq004viaus5y4atq5q
cmpwh4mug01f7ia40k8xjt7zh	cmpm7s7j8003liauswjjxk8ex
cmpwh4mun01f8ia4095uxaeef	cmpm6ioph002niausbtnw8zo3
cmpwh4mun01f8ia4095uxaeef	cmpmalk2l004qiausp3pm1z6f
cmpwh4mun01f8ia4095uxaeef	cmpmamcwq004viaus5y4atq5q
cmpwh4mun01f8ia4095uxaeef	cmpm7s7j8003liauswjjxk8ex
cmpwh4mvd01fcia40om2yn7ze	cmpm7rduc003iiausmprulwf1
cmpwh4mwt01foia40vztvjkjv	cmpm4p7n6001qiausf4s5ahht
cmpwh4mwt01foia40vztvjkjv	cmpmamcwq004viaus5y4atq5q
cmpwh4mwt01foia40vztvjkjv	cmpm6ioph002niausbtnw8zo3
cmpwh4mwt01foia40vztvjkjv	cmpm7nh3s0036iausxm44cu9t
cmpwh4mwt01foia40vztvjkjv	cmpm7wjyu003riaus32ihl37b
cmpwh4mxx01g2ia40vrj7prtz	cmpm6ioph002niausbtnw8zo3
cmpwh4mxx01g2ia40vrj7prtz	cmpm9wtav0040iaus5stdmg52
cmpwh4mxx01g2ia40vrj7prtz	cmpm6z80v002viausbcqx3ozw
cmpwh4myw01g8ia403flpkrf5	cmpm4p7n6001qiausf4s5ahht
cmpwh4myw01g8ia403flpkrf5	cmpm6z80v002viausbcqx3ozw
cmpwh4n0c01gmia40wnfvyz62	cmpmamcwq004viaus5y4atq5q
cmpwh4n1p01h0ia403jl1afzv	cmpmajetn004iiaus2vel52gz
cmpwh4n3801hcia40utuufvn9	cmpmamcwq004viaus5y4atq5q
cmpwh4n3801hcia40utuufvn9	cmpm7wjyu003riaus32ihl37b
cmpwh4n3801hcia40utuufvn9	cmpm7y2d5003uiaushuvnjj0w
cmpwh4n4n01hoia400gs17oyc	cmpm6ioph002niausbtnw8zo3
cmpwh4n4n01hoia400gs17oyc	cmpmamcwq004viaus5y4atq5q
cmpwh4n4n01hoia400gs17oyc	cmpmbbun40051iaus0ypzmgo0
cmpwh4n4n01hoia400gs17oyc	cmpm7nh3s0036iausxm44cu9t
cmpwh4n4n01hoia400gs17oyc	cmpm7wjyu003riaus32ihl37b
cmpwh4n5p01hwia40cp0ae83w	cmpmamcwq004viaus5y4atq5q
cmpwh4n5p01hwia40cp0ae83w	cmpm7nh3s0036iausxm44cu9t
cmpwh4n5p01hwia40cp0ae83w	cmpm7wjyu003riaus32ihl37b
cmpwh4n6i01i0ia40d79bf5vw	cmpm7y2d5003uiaushuvnjj0w
cmpwh4n7h01i8ia402gvxleje	cmpmamcwq004viaus5y4atq5q
cmpwh4n7h01i8ia402gvxleje	cmpm7nh3s0036iausxm44cu9t
cmpwh4n7h01i8ia402gvxleje	cmpm7y2d5003uiaushuvnjj0w
cmpwh4n8901ieia406hpg7adg	cmpmbbun40051iaus0ypzmgo0
cmpwh4n9m01itia40n5tl201h	cmpmamcwq004viaus5y4atq5q
cmpwh4n9m01itia40n5tl201h	cmpm71afq0031iausuxhheoyf
cmpwh4na901ixia404rb8n5x1	cmpmajetn004iiaus2vel52gz
cmpwh4nay01j1ia40ih4ccf9j	cmpmajetn004iiaus2vel52gz
cmpwh4nbr01j5ia4020wbnjw1	cmpmajetn004iiaus2vel52gz
cmpwh4ndp01jtia40logyw0e6	cmpmcyll0005tiaus9udmpd06
cmpwh4ndp01jtia40logyw0e6	cmpm6z80v002viausbcqx3ozw
cmpwh4nfi01k7ia40fuk8ipkg	cmpmcmiud0058iaustuwfw2sp
cmpwh4nfi01k7ia40fuk8ipkg	cmpmcsydy005biaus8mz8wrn4
cmpwh4nfo01k8ia40oun321tw	cmpmcmiud0058iaustuwfw2sp
cmpwh4nfo01k8ia40oun321tw	cmpmcsydy005biaus8mz8wrn4
cmpwh4ngd01keia40kgoe623z	cmpm7rduc003iiausmprulwf1
cmpwh4nh301kkia409ffr6k0z	cmpm6z80v002viausbcqx3ozw
cmpwh4nig01kyia40yvvtagh5	cmpmajetn004iiaus2vel52gz
cmpwh4nig01kyia40yvvtagh5	cmpmamcwq004viaus5y4atq5q
cmpwh4nig01kyia40yvvtagh5	cmpm6ioph002niausbtnw8zo3
cmpwh4nig01kyia40yvvtagh5	cmpm7nh3s0036iausxm44cu9t
cmpwh4nig01kyia40yvvtagh5	cmpm7y2d5003uiaushuvnjj0w
cmpwh4njh01l6ia4017k6cmv7	cmpmbbun40051iaus0ypzmgo0
cmpwh4njh01l6ia4017k6cmv7	cmpmajetn004iiaus2vel52gz
cmpwh4nk701laia40wlxdatjx	cmpm7wjyu003riaus32ihl37b
cmpwh4nlc01lmia402r0tyl93	cmpmajetn004iiaus2vel52gz
cmpwh4nlc01lmia402r0tyl93	cmpm7nh3s0036iausxm44cu9t
cmpwh4nlc01lmia402r0tyl93	cmpm7wjyu003riaus32ihl37b
cmpwh4nmw01m2ia4004u4rj7y	cmpmamcwq004viaus5y4atq5q
cmpwh4nmw01m2ia4004u4rj7y	cmpmajetn004iiaus2vel52gz
cmpwh4nmw01m2ia4004u4rj7y	cmpm6ioph002niausbtnw8zo3
cmpwh4nmw01m2ia4004u4rj7y	cmpm7nh3s0036iausxm44cu9t
cmpwh4nmw01m2ia4004u4rj7y	cmpm7wjyu003riaus32ihl37b
cmpwh4nnp01maia405lra7im0	cmpm6ioph002niausbtnw8zo3
cmpwh4nnp01maia405lra7im0	cmpm7nh3s0036iausxm44cu9t
cmpwh4noo01mkia40q6prwm10	cmpmajetn004iiaus2vel52gz
cmpwh4noo01mkia40q6prwm10	cmpm7wjyu003riaus32ihl37b
cmpwh4npq01msia407rmf1nrw	cmpmamcwq004viaus5y4atq5q
cmpwh4npq01msia407rmf1nrw	cmpm7nh3s0036iausxm44cu9t
cmpwh4npq01msia407rmf1nrw	cmpm7y2d5003uiaushuvnjj0w
cmpwh4nql01n0ia40prlrxun2	cmpm7wjyu003riaus32ihl37b
cmpwh4nsj01noia40z2zpzn47	cmpm6ioph002niausbtnw8zo3
cmpwh4nsj01noia40z2zpzn47	cmpmamcwq004viaus5y4atq5q
cmpwh4nsj01noia40z2zpzn47	cmpm7wjyu003riaus32ihl37b
cmpwh4nsj01noia40z2zpzn47	cmpm7nh3s0036iausxm44cu9t
cmpwh4nu301o2ia40z9ybj70d	cmpmajetn004iiaus2vel52gz
cmpwh4nu301o2ia40z9ybj70d	cmpmamcwq004viaus5y4atq5q
cmpwh4nu301o2ia40z9ybj70d	cmpm7nh3s0036iausxm44cu9t
cmpwh4nu301o2ia40z9ybj70d	cmpm7wjyu003riaus32ihl37b
cmpwh4nvp01oiia40gvifeh6q	cmpmamcwq004viaus5y4atq5q
cmpwh4nvp01oiia40gvifeh6q	cmpm6ioph002niausbtnw8zo3
cmpwh4nvp01oiia40gvifeh6q	cmpm7nh3s0036iausxm44cu9t
cmpwh4nvp01oiia40gvifeh6q	cmpm7wjyu003riaus32ihl37b
cmpwh4nvp01oiia40gvifeh6q	cmpm7y2d5003uiaushuvnjj0w
cmpwh4nx201owia40cvo2rvig	cmpmamcwq004viaus5y4atq5q
cmpwh4nx201owia40cvo2rvig	cmpmajetn004iiaus2vel52gz
cmpwh4nx201owia40cvo2rvig	cmpm7nh3s0036iausxm44cu9t
cmpwh4nx201owia40cvo2rvig	cmpm7y2d5003uiaushuvnjj0w
cmpwh4nyq01paia40rdf08vid	cmpm6ioph002niausbtnw8zo3
cmpwh4nyq01paia40rdf08vid	cmpmajetn004iiaus2vel52gz
cmpwh4nyq01paia40rdf08vid	cmpmamcwq004viaus5y4atq5q
cmpwh4nyq01paia40rdf08vid	cmpm7nh3s0036iausxm44cu9t
cmpwh4nyq01paia40rdf08vid	cmpm7wjyu003riaus32ihl37b
cmpwh4o1701q2ia40alh5ie6g	cmpm7s7j8003liauswjjxk8ex
cmpwh4o1701q2ia40alh5ie6g	cmpmamcwq004viaus5y4atq5q
cmpwh4o1701q2ia40alh5ie6g	cmpm6ioph002niausbtnw8zo3
cmpwh4o1701q2ia40alh5ie6g	cmpmajetn004iiaus2vel52gz
cmpwh4o1701q2ia40alh5ie6g	cmpm7nh3s0036iausxm44cu9t
cmpwh4o1701q2ia40alh5ie6g	cmpm7wjyu003riaus32ihl37b
cmpwh4o1701q2ia40alh5ie6g	cmpm7y2d5003uiaushuvnjj0w
cmpwh4o1701q2ia40alh5ie6g	cmpmcsydy005biaus8mz8wrn4
cmpwh4o1z01q6ia40u32xnakq	cmpm70pwb002yiaus2m2fx6w0
cmpwh4o3401qeia40phd7zw5w	cmpm6jzck002siausjij512h3
cmpwh4o3401qeia40phd7zw5w	cmpmalk2l004qiausp3pm1z6f
cmpwh4o3401qeia40phd7zw5w	cmpmcxxg5005qiausn9g2slk7
cmpwh4o3y01qkia40zyxlsacq	cmpm6z80v002viausbcqx3ozw
cmpwh4o3y01qkia40zyxlsacq	cmpm9wtav0040iaus5stdmg52
cmpwh4o4z01qqia40c0qrw4r6	cmpmaaekm0046iausrahtxbtp
cmpwh4o4z01qqia40c0qrw4r6	cmpm6jzck002siausjij512h3
cmpwh4o5u01quia40l9h9z4ft	cmpm71afq0031iausuxhheoyf
cmpwh4o7001r2ia40pgdanlnv	cmpmamcwq004viaus5y4atq5q
cmpwh4o7001r2ia40pgdanlnv	cmpmajetn004iiaus2vel52gz
cmpwh4o7001r2ia40pgdanlnv	cmpm7nh3s0036iausxm44cu9t
cmpwh4o8c01rcia40iw77nf28	cmpm6ioph002niausbtnw8zo3
cmpwh4o8c01rcia40iw77nf28	cmpm6z80v002viausbcqx3ozw
cmpwh4o9801rkia40d69n2y71	cmpm7y2d5003uiaushuvnjj0w
cmpwh4ocg01rsia40lisbrivl	cmpm4p7n6001qiausf4s5ahht
cmpwh4ocg01rsia40lisbrivl	cmpm6jzck002siausjij512h3
cmpwh4odf01ryia407ww6mhlx	cmpm7sv69003oiausjksd398m
cmpwh4odf01ryia407ww6mhlx	cmpmcsydy005biaus8mz8wrn4
cmpwh4oek01saia400uxb5pwk	cmpm7wjyu003riaus32ihl37b
cmpwh4oek01saia400uxb5pwk	cmpm7nh3s0036iausxm44cu9t
cmpwh4ofh01siia408xz5aw6a	cmpmajetn004iiaus2vel52gz
cmpwh4ofh01siia408xz5aw6a	cmpmbbun40051iaus0ypzmgo0
cmpwh4oge01sqia400mkj0ezw	cmpmajetn004iiaus2vel52gz
cmpwh4ohs01t0ia40vg001v2l	cmpmbbun40051iaus0ypzmgo0
cmpwh4oiu01t8ia40zb7pdh2h	cmpmamcwq004viaus5y4atq5q
cmpwh4oiu01t8ia40zb7pdh2h	cmpm6ioph002niausbtnw8zo3
cmpwh4oiu01t8ia40zb7pdh2h	cmpm7rduc003iiausmprulwf1
cmpwh4ojo01teia40j03rg1vk	cmpmamcwq004viaus5y4atq5q
cmpwh4ojo01teia40j03rg1vk	cmpm7p9r4003ciausxxtm77m0
cmpwh4okh01tkia405uo3wrye	cmpmamcwq004viaus5y4atq5q
cmpwh4okh01tkia405uo3wrye	cmpm7nh3s0036iausxm44cu9t
cmpwh4ols01twia40c9o5vsbi	cmpmakc8i004liaus6oylw747
cmpwh4ols01twia40c9o5vsbi	cmpm7s7j8003liauswjjxk8ex
cmpwh4ols01twia40c9o5vsbi	cmpmamcwq004viaus5y4atq5q
cmpwh4ols01twia40c9o5vsbi	cmpmcmiud0058iaustuwfw2sp
cmpwh4ols01twia40c9o5vsbi	cmpmcsydy005biaus8mz8wrn4
cmpwh4omk01u2ia40lgaxsmfs	cmpmajetn004iiaus2vel52gz
cmpwh4omk01u2ia40lgaxsmfs	cmpmbbun40051iaus0ypzmgo0
cmpwh4ona01u8ia4073rumvpc	cmpm7z8kc003xiauswx84u6ek
cmpwh4ood01ukia40ovh6ipy4	cmpmajetn004iiaus2vel52gz
cmpwh4ood01ukia40ovh6ipy4	cmpmamcwq004viaus5y4atq5q
cmpwh4ood01ukia40ovh6ipy4	cmpm7z8kc003xiauswx84u6ek
cmpwh4op701usia40jage9r2s	cmpmcsydy005biaus8mz8wrn4
cmpwh4op701usia40jage9r2s	cmpmcmiud0058iaustuwfw2sp
cmpwh4opf01utia40p4tydq82	cmpmcsydy005biaus8mz8wrn4
cmpwh4opf01utia40p4tydq82	cmpmcmiud0058iaustuwfw2sp
cmpwh4oqr01v5ia40nvsx8jf1	cmpm7rduc003iiausmprulwf1
cmpwh4os101vhia40h1m88pcx	cmpmamcwq004viaus5y4atq5q
cmpwh4os101vhia40h1m88pcx	cmpm7nh3s0036iausxm44cu9t
cmpwh4os101vhia40h1m88pcx	cmpm7y2d5003uiaushuvnjj0w
cmpwh4osq01vnia40fq5q3ble	cmpm7rduc003iiausmprulwf1
cmpwh4ou601wnia405xhc1rt4	cmpmcyll0005tiaus9udmpd06
cmpwh4ou601wnia405xhc1rt4	cmpm6z80v002viausbcqx3ozw
cmpwh4ou601wnia405xhc1rt4	cmpm9wtav0040iaus5stdmg52
cmpwh4ove01x9ia403512p8mq	cmpmcyll0005tiaus9udmpd06
cmpwh4ow401xlia40ffnt76tk	cmpm6z80v002viausbcqx3ozw
cmpwh4ow401xlia40ffnt76tk	cmpm9wtav0040iaus5stdmg52
cmpwh4ox001xxia40mzax7om4	cmpmamcwq004viaus5y4atq5q
cmpwh4ox001xxia40mzax7om4	cmpmajetn004iiaus2vel52gz
cmpwh4ox001xxia40mzax7om4	cmpm7z8kc003xiauswx84u6ek
cmpwh4oxj01y1ia40j9a0s1y7	cmpm71afq0031iausuxhheoyf
cmpwh4oy201y5ia4054x1djvu	cmpm71afq0031iausuxhheoyf
cmpwh4oy701y6ia40te7rse8l	cmpm71afq0031iausuxhheoyf
cmpwh4oyb01y7ia40rbaafll8	cmpm71afq0031iausuxhheoyf
cmpwh4oyf01y8ia40gwoe5a25	cmpm71afq0031iausuxhheoyf
cmpwh4oyj01y9ia40nizv97dk	cmpm71afq0031iausuxhheoyf
cmpwh4oyo01yaia40we4oxlby	cmpm71afq0031iausuxhheoyf
cmpwh4oys01ybia40hn8fwk97	cmpm71afq0031iausuxhheoyf
cmpwh4oyy01ycia40fc6m4huc	cmpm71afq0031iausuxhheoyf
cmpwh4oz301ydia40fob3ro0a	cmpm71afq0031iausuxhheoyf
cmpwh4oz801yeia408s623phx	cmpm71afq0031iausuxhheoyf
cmpwh4ozc01yfia403kqlil38	cmpm71afq0031iausuxhheoyf
cmpwh4ozg01ygia40zjc9asxu	cmpm71afq0031iausuxhheoyf
cmpwh4ozx01ykia40jw7u56gb	cmpm70pwb002yiaus2m2fx6w0
cmpwh4p0k01yqia404ti8xil7	cmpm7s7j8003liauswjjxk8ex
cmpwh4p0o01yria40b1t78ycf	cmpm7s7j8003liauswjjxk8ex
cmpwh4p1d01yzia40rqdx29yd	cmpmbbun40051iaus0ypzmgo0
cmpwh4p1d01yzia40rqdx29yd	cmpmajetn004iiaus2vel52gz
cmpwh4p1h01z0ia408xrs606p	cmpmbbun40051iaus0ypzmgo0
cmpwh4p1h01z0ia408xrs606p	cmpmajetn004iiaus2vel52gz
cmpwh4p2801zcia40n9z8s5qb	cmpm7q17h003fiausimucssfj
cmpwh4p2c01zdia40847ue70z	cmpm7q17h003fiausimucssfj
cmpwh4p3h01zpia40wg2be8gg	cmpm7s7j8003liauswjjxk8ex
cmpwh4p3h01zpia40wg2be8gg	cmpmcmiud0058iaustuwfw2sp
cmpwh4p4i020bia405g953ztg	cmpm6jzck002siausjij512h3
cmpwh4p4i020bia405g953ztg	cmpm6ioph002niausbtnw8zo3
cmpwh4p4i020bia405g953ztg	cmpmcsydy005biaus8mz8wrn4
cmpwh4p4i020bia405g953ztg	cmpm7rduc003iiausmprulwf1
cmpwh4p4i020bia405g953ztg	cmpm71afq0031iausuxhheoyf
cmpwh4p5t020ria40nwqrqhe9	cmpmcxxg5005qiausn9g2slk7
cmpwh4p5t020ria40nwqrqhe9	cmpmaaekm0046iausrahtxbtp
cmpwh4p5t020ria40nwqrqhe9	cmpm4p7n6001qiausf4s5ahht
cmpwh4p5t020ria40nwqrqhe9	cmpm6ioph002niausbtnw8zo3
cmpwh4p5t020ria40nwqrqhe9	cmpmcv3uk005kiausndde2tr6
cmpwh4p5t020ria40nwqrqhe9	cmpm6jzck002siausjij512h3
cmpwh4p5t020ria40nwqrqhe9	cmpm7rduc003iiausmprulwf1
cmpwh4p6i0211ia40x6c6alkm	cmpmajetn004iiaus2vel52gz
cmpwh4p760217ia403nd2ikwv	cmpm6z80v002viausbcqx3ozw
cmpwh4p760217ia403nd2ikwv	cmpm9wtav0040iaus5stdmg52
cmpwh4p7z021fia40e5tg2t1a	cmpmamcwq004viaus5y4atq5q
cmpwh4p7z021fia40e5tg2t1a	cmpm7nh3s0036iausxm44cu9t
cmpwh4p7z021fia40e5tg2t1a	cmpm7y2d5003uiaushuvnjj0w
cmpwh4p8t021nia40rnaanit0	cmpmamcwq004viaus5y4atq5q
cmpwh4p8t021nia40rnaanit0	cmpm7nh3s0036iausxm44cu9t
cmpwh4p8t021nia40rnaanit0	cmpm7y2d5003uiaushuvnjj0w
cmpwh4p9z022dia4058snjufo	cmpmakc8i004liaus6oylw747
cmpwh4p9z022dia4058snjufo	cmpm4p7n6001qiausf4s5ahht
cmpwh4p9z022dia4058snjufo	cmpm6z80v002viausbcqx3ozw
cmpwh4pbo0231ia4085mux3dw	cmpm4p7n6001qiausf4s5ahht
cmpwh4pcc0239ia40q2rl2lhe	cmpmajetn004iiaus2vel52gz
cmpwh4pd9023jia406u8jzhb2	cmpmajetn004iiaus2vel52gz
cmpwh4pe0023ria40iyabpzvz	cmpmajetn004iiaus2vel52gz
cmpwh4pe0023ria40iyabpzvz	cmpmbbun40051iaus0ypzmgo0
cmpwh4peu0243ia406eau36le	cmpmajetn004iiaus2vel52gz
cmpwh4peu0243ia406eau36le	cmpm7z8kc003xiauswx84u6ek
cmpwh4pfg024bia40sbjgr46l	cmpmajetn004iiaus2vel52gz
cmpwh4pg4024jia40qso3ceg1	cmpmajetn004iiaus2vel52gz
cmpwh4pgw024pia400axsyvav	cmpmbbun40051iaus0ypzmgo0
cmpwh4phq024via407duho4m5	cmpmajetn004iiaus2vel52gz
cmpwh4phq024via407duho4m5	cmpm7z8kc003xiauswx84u6ek
cmpwh4pib0251ia40o4hwuges	cmpm7y2d5003uiaushuvnjj0w
cmpwh4pj00257ia406qpb6vqm	cmpmamcwq004viaus5y4atq5q
cmpwh4pj00257ia406qpb6vqm	cmpm71afq0031iausuxhheoyf
cmpwh4pj50258ia404bse55xq	cmpmamcwq004viaus5y4atq5q
cmpwh4pj50258ia404bse55xq	cmpm71afq0031iausuxhheoyf
cmpwh4pko025qia4004kg8d1d	cmpm7nzmm0039iauss19l621g
cmpwh4pko025qia4004kg8d1d	cmpmamcwq004viaus5y4atq5q
cmpwh4pko025qia4004kg8d1d	cmpm7p9r4003ciausxxtm77m0
cmpwh4pko025qia4004kg8d1d	cmpm7s7j8003liauswjjxk8ex
cmpwh4pko025qia4004kg8d1d	cmpmbbun40051iaus0ypzmgo0
cmpwh4pko025qia4004kg8d1d	cmpm7z8kc003xiauswx84u6ek
cmpwh4pko025qia4004kg8d1d	cmpm7y2d5003uiaushuvnjj0w
cmpwh4pko025qia4004kg8d1d	cmpmcmiud0058iaustuwfw2sp
cmpwh4plg025yia40d1bep95v	cmpm6ioph002niausbtnw8zo3
cmpwh4plg025yia40d1bep95v	cmpmamcwq004viaus5y4atq5q
cmpwh4plg025yia40d1bep95v	cmpm71afq0031iausuxhheoyf
cmpwh4pm70266ia40bzsy302t	cmpmamcwq004viaus5y4atq5q
cmpwh4pm70266ia40bzsy302t	cmpm7nh3s0036iausxm44cu9t
cmpwh4pm70266ia40bzsy302t	cmpm7y2d5003uiaushuvnjj0w
cmpwh4pni026mia4001ls23yo	cmpmbbun40051iaus0ypzmgo0
cmpwh4pni026mia4001ls23yo	cmpmajetn004iiaus2vel52gz
cmpwh4po0026qia40zil4zsvb	cmpmbbun40051iaus0ypzmgo0
cmpwh4ppc027oia40i0k9cipu	cmpm6ioph002niausbtnw8zo3
cmpwh4ppc027oia40i0k9cipu	cmpmcyll0005tiaus9udmpd06
cmpwh4ppc027oia40i0k9cipu	cmpm9wtav0040iaus5stdmg52
cmpwh4pph027pia40t7q1cb8q	cmpm6ioph002niausbtnw8zo3
cmpwh4pph027pia40t7q1cb8q	cmpmcyll0005tiaus9udmpd06
cmpwh4pph027pia40t7q1cb8q	cmpm9wtav0040iaus5stdmg52
cmpwh4pr7028dia40gw3be9fu	cmpm7p9r4003ciausxxtm77m0
cmpwh4pr7028dia40gw3be9fu	cmpm7s7j8003liauswjjxk8ex
cmpwh4pr7028dia40gw3be9fu	cmpm7nzmm0039iauss19l621g
cmpwh4pr7028dia40gw3be9fu	cmpm7sv69003oiausjksd398m
cmpwh4pr7028dia40gw3be9fu	cmpm9wtav0040iaus5stdmg52
cmpwh4pr7028dia40gw3be9fu	cmpm7rduc003iiausmprulwf1
cmpwh4pr7028dia40gw3be9fu	cmpm7y2d5003uiaushuvnjj0w
cmpwh4pr7028dia40gw3be9fu	cmpm71afq0031iausuxhheoyf
cmpwh4pr7028dia40gw3be9fu	cmpm7z8kc003xiauswx84u6ek
cmpwh4ps9028zia40bu7oouha	cmpm70pwb002yiaus2m2fx6w0
cmpwh4psx0293ia40o1kkx51x	cmpm70pwb002yiaus2m2fx6w0
cmpwh4ptn029bia403wukdmd4	cmpmcmiud0058iaustuwfw2sp
cmpwh4ptn029bia403wukdmd4	cmpmcsydy005biaus8mz8wrn4
cmpwh4pts029cia407g0z447t	cmpmcmiud0058iaustuwfw2sp
cmpwh4pts029cia407g0z447t	cmpmcsydy005biaus8mz8wrn4
cmpwh4ptw029dia40txhbd4mt	cmpmcmiud0058iaustuwfw2sp
cmpwh4ptw029dia40txhbd4mt	cmpmcsydy005biaus8mz8wrn4
cmpwh4pu0029eia40oy6kmluv	cmpmcmiud0058iaustuwfw2sp
cmpwh4pu0029eia40oy6kmluv	cmpmcsydy005biaus8mz8wrn4
cmpwh4pun029mia40rpjaw7iu	cmpmamcwq004viaus5y4atq5q
cmpwh4pv7029sia40cnirileg	cmpm7rduc003iiausmprulwf1
cmpwh4pvo029wia402gbsg5ar	cmpm7y2d5003uiaushuvnjj0w
cmpwh4pw502a0ia40nm0eqglr	cmpmcxxg5005qiausn9g2slk7
cmpwh4px902aaia40g6sf5cac	cmpmbbun40051iaus0ypzmgo0
cmpwh4px902aaia40g6sf5cac	cmpmamcwq004viaus5y4atq5q
cmpwh4px902aaia40g6sf5cac	cmpm7nh3s0036iausxm44cu9t
cmpwh4px902aaia40g6sf5cac	cmpm7y2d5003uiaushuvnjj0w
cmpwh4pxy02agia400womkze8	cmpm6jzck002siausjij512h3
cmpwh4pxy02agia400womkze8	cmpm6z80v002viausbcqx3ozw
cmpwh4pyk02amia409zjsdwf0	cmpm6jzck002siausjij512h3
cmpwh4pyk02amia409zjsdwf0	cmpm6z80v002viausbcqx3ozw
cmpwh4pz702asia40fmsdpvsc	cmpm6z80v002viausbcqx3ozw
cmpwh4pz702asia40fmsdpvsc	cmpm9wtav0040iaus5stdmg52
cmpwh4pzr02awia40mvzeoq5n	cmpm71afq0031iausuxhheoyf
cmpwh4q0802b0ia40ekc37ytr	cmpm71afq0031iausuxhheoyf
cmpwh4q0c02b1ia40x9ccwmpk	cmpm71afq0031iausuxhheoyf
cmpwh4q0g02b2ia40eehzmdjc	cmpm71afq0031iausuxhheoyf
cmpwh4q0l02b3ia40e9dzhebb	cmpm71afq0031iausuxhheoyf
cmpwh4q0q02b4ia40zil19dtq	cmpm71afq0031iausuxhheoyf
cmpwh4q0u02b5ia40leyxz8q0	cmpm71afq0031iausuxhheoyf
cmpwh4q0y02b6ia40179vh3fw	cmpm71afq0031iausuxhheoyf
cmpwh4q1302b7ia40gqpigl8s	cmpm71afq0031iausuxhheoyf
cmpwh4q1702b8ia409o4j9fp9	cmpm71afq0031iausuxhheoyf
cmpwh4q1b02b9ia405dmcoct4	cmpm71afq0031iausuxhheoyf
cmpwh4q1f02baia40m5jwwjwo	cmpm71afq0031iausuxhheoyf
cmpwh4q2b02biia402c138h0f	cmpmcxxg5005qiausn9g2slk7
cmpwh4q2z02boia40oqsk6evm	cmpmalk2l004qiausp3pm1z6f
cmpwh4q2z02boia40oqsk6evm	cmpm70pwb002yiaus2m2fx6w0
cmpwh4q4002byia403d75tcq0	cmpmamcwq004viaus5y4atq5q
cmpwh4q4002byia403d75tcq0	cmpm7rduc003iiausmprulwf1
cmpwh4q4u02c6ia403fcxzko5	cmpmamcwq004viaus5y4atq5q
cmpwh4q4u02c6ia403fcxzko5	cmpm7nh3s0036iausxm44cu9t
cmpwh4q4u02c6ia403fcxzko5	cmpm7y2d5003uiaushuvnjj0w
cmpwh4q6b02cmia40ncexig5e	cmpmamcwq004viaus5y4atq5q
cmpwh4q6b02cmia40ncexig5e	cmpm6jzck002siausjij512h3
cmpwh4q6b02cmia40ncexig5e	cmpmbbun40051iaus0ypzmgo0
cmpwh4q6b02cmia40ncexig5e	cmpmcxxg5005qiausn9g2slk7
cmpwh4q6b02cmia40ncexig5e	cmpm7nh3s0036iausxm44cu9t
cmpwh4q7002csia40m3rq79lp	cmpmalk2l004qiausp3pm1z6f
cmpwh4q7002csia40m3rq79lp	cmpm71afq0031iausuxhheoyf
cmpwh4q8u02dcia400gkznb1e	cmpmamcwq004viaus5y4atq5q
cmpwh4q8u02dcia400gkznb1e	cmpm7nh3s0036iausxm44cu9t
cmpwh4q8u02dcia400gkznb1e	cmpm7y2d5003uiaushuvnjj0w
cmpwh4qar02dyia40wuzgms02	cmpmalk2l004qiausp3pm1z6f
cmpwh4qar02dyia40wuzgms02	cmpm7y2d5003uiaushuvnjj0w
cmpwh4qbl02e8ia40rlv2az9l	cmpmbbun40051iaus0ypzmgo0
cmpwh4qbl02e8ia40rlv2az9l	cmpm7nh3s0036iausxm44cu9t
cmpwh4qc302ecia4037bj70lc	cmpmajetn004iiaus2vel52gz
cmpwh4qd202emia40vgi8twx2	cmpmamcwq004viaus5y4atq5q
cmpwh4qd202emia40vgi8twx2	cmpmcwkjj005niausxhpwr0rq
cmpwh4qd202emia40vgi8twx2	cmpm7q17h003fiausimucssfj
cmpwh4qd202emia40vgi8twx2	cmpmctto9005eiaus7jv5w8sw
cmpwh4qd902enia402rtyp64h	cmpmamcwq004viaus5y4atq5q
cmpwh4qd902enia402rtyp64h	cmpmcwkjj005niausxhpwr0rq
cmpwh4qd902enia402rtyp64h	cmpm7q17h003fiausimucssfj
cmpwh4qd902enia402rtyp64h	cmpmctto9005eiaus7jv5w8sw
cmpwh4qe302evia40svzj1s57	cmpmamcwq004viaus5y4atq5q
cmpwh4qe302evia40svzj1s57	cmpm7nh3s0036iausxm44cu9t
cmpwh4qe302evia40svzj1s57	cmpm7y2d5003uiaushuvnjj0w
cmpwh4qez02f3ia401pv1fkhf	cmpmalk2l004qiausp3pm1z6f
cmpwh4qez02f3ia401pv1fkhf	cmpmamcwq004viaus5y4atq5q
cmpwh4qez02f3ia401pv1fkhf	cmpm7z8kc003xiauswx84u6ek
cmpwh4qg902ffia40rns69j4r	cmpm6ioph002niausbtnw8zo3
cmpwh4qg902ffia40rns69j4r	cmpm7sv69003oiausjksd398m
cmpwh4qg902ffia40rns69j4r	cmpm6z80v002viausbcqx3ozw
cmpwh4qh002flia40kykhb67s	cmpmamcwq004viaus5y4atq5q
cmpwh4qh002flia40kykhb67s	cmpm7y2d5003uiaushuvnjj0w
cmpwh4qi102fxia40fegili8f	cmpmamcwq004viaus5y4atq5q
cmpwh4qi102fxia40fegili8f	cmpm6ioph002niausbtnw8zo3
cmpwh4qi102fxia40fegili8f	cmpmaayyh0049iausqyybqoai
cmpwh4qi102fxia40fegili8f	cmpm7nh3s0036iausxm44cu9t
cmpwh4qi102fxia40fegili8f	cmpm7y2d5003uiaushuvnjj0w
cmpwh4qim02g1ia40i1714i6i	cmpmajetn004iiaus2vel52gz
cmpwh4qkb02gfia405r8cgr5u	cmpm7s7j8003liauswjjxk8ex
cmpwh4qkb02gfia405r8cgr5u	cmpm6z80v002viausbcqx3ozw
cmpwh4qla02gnia40c8nz8krn	cmpmalk2l004qiausp3pm1z6f
cmpwh4qm302gvia40xexwlmkc	cmpmcug27005hiauszp8pd7lt
cmpwh4qm302gvia40xexwlmkc	cmpmcsydy005biaus8mz8wrn4
cmpwh4qm302gvia40xexwlmkc	cmpmcmiud0058iaustuwfw2sp
cmpwh4qm802gwia40elhh7wet	cmpmcug27005hiauszp8pd7lt
cmpwh4qm802gwia40elhh7wet	cmpmcsydy005biaus8mz8wrn4
cmpwh4qm802gwia40elhh7wet	cmpmcmiud0058iaustuwfw2sp
cmpwh4qn102h4ia40au175hp1	cmpmcug27005hiauszp8pd7lt
cmpwh4qn102h4ia40au175hp1	cmpmalk2l004qiausp3pm1z6f
cmpwh4qn102h4ia40au175hp1	cmpmamcwq004viaus5y4atq5q
cmpwh4qno02haia40qo30royj	cmpmcug27005hiauszp8pd7lt
cmpwh4qno02haia40qo30royj	cmpm7rduc003iiausmprulwf1
cmpwh4qo902heia4069r0n696	cmpm70pwb002yiaus2m2fx6w0
cmpwh4qot02hiia40988jxkhx	cmpmajetn004iiaus2vel52gz
cmpwh4qpn02hqia40k6yxb6rb	cmpm7s7j8003liauswjjxk8ex
cmpwh4qpn02hqia40k6yxb6rb	cmpmamcwq004viaus5y4atq5q
cmpwh4qpn02hqia40k6yxb6rb	cmpm6z80v002viausbcqx3ozw
cmpwh4qq902huia40nk6y9v57	cmpm71afq0031iausuxhheoyf
cmpwh4qqy02hyia40uohfp26r	cmpm71afq0031iausuxhheoyf
cmpwh4qr402hzia406nq1bkm4	cmpm71afq0031iausuxhheoyf
cmpwh4qra02i0ia4004fbdu75	cmpm71afq0031iausuxhheoyf
cmpwh4qrf02i1ia40v8f44kur	cmpm71afq0031iausuxhheoyf
cmpwh4qrk02i2ia4051yg7wfs	cmpm71afq0031iausuxhheoyf
cmpwh4qrp02i3ia40kogs8q89	cmpm71afq0031iausuxhheoyf
cmpwh4qrv02i4ia40wznjl6it	cmpm71afq0031iausuxhheoyf
cmpwh4qs002i5ia403c3numxp	cmpm71afq0031iausuxhheoyf
cmpwh4qs402i6ia404civ2lv9	cmpm71afq0031iausuxhheoyf
cmpwh4qs902i7ia40ddpe4xia	cmpm71afq0031iausuxhheoyf
cmpwh4qse02i8ia40se8s4mkn	cmpm71afq0031iausuxhheoyf
cmpwh4qsj02i9ia40ao2tdql8	cmpm71afq0031iausuxhheoyf
cmpwh4qsn02iaia40ikmfr3ql	cmpm71afq0031iausuxhheoyf
cmpwh4qt602ieia40f4xzhj1e	cmpm71afq0031iausuxhheoyf
cmpwh4qu602ioia40py8e1ik8	cmpmamcwq004viaus5y4atq5q
cmpwh4qu602ioia40py8e1ik8	cmpm6jzck002siausjij512h3
cmpwh4quy02iwia40t5p30dpw	cmpmajetn004iiaus2vel52gz
cmpwh4quy02iwia40t5p30dpw	cmpmbbun40051iaus0ypzmgo0
cmpwh4qvx02j4ia40xewytioh	cmpmcyll0005tiaus9udmpd06
cmpwh4qvx02j4ia40xewytioh	cmpm6z80v002viausbcqx3ozw
cmpwh4qvx02j4ia40xewytioh	cmpm9wtav0040iaus5stdmg52
cmpwh4qww02jcia40bhk5mu8o	cmpm4p7n6001qiausf4s5ahht
cmpwh4qxz02joia40c00gm85c	cmpm4p7n6001qiausf4s5ahht
cmpwh4qxz02joia40c00gm85c	cmpmcxxg5005qiausn9g2slk7
cmpwh4qxz02joia40c00gm85c	cmpm6jzck002siausjij512h3
cmpwh4qxz02joia40c00gm85c	cmpmamcwq004viaus5y4atq5q
cmpwh4qxz02joia40c00gm85c	cmpm7rduc003iiausmprulwf1
cmpwh4qyp02jyia407i36x0yb	cmpm7s7j8003liauswjjxk8ex
cmpwh4qyp02jyia407i36x0yb	cmpmalk2l004qiausp3pm1z6f
cmpwh4qzh02k6ia408ife8rs1	cmpmcxxg5005qiausn9g2slk7
cmpwh4qzh02k6ia408ife8rs1	cmpm7p9r4003ciausxxtm77m0
cmpwh4qzh02k6ia408ife8rs1	cmpm7rduc003iiausmprulwf1
cmpwh4r0902keia40kyn1anez	cmpmcxxg5005qiausn9g2slk7
cmpwh4r0902keia40kyn1anez	cmpmalk2l004qiausp3pm1z6f
cmpwh4r0902keia40kyn1anez	cmpm7rduc003iiausmprulwf1
cmpwh4r1502kmia40ok10lchc	cmpm6jzck002siausjij512h3
cmpwh4r1502kmia40ok10lchc	cmpm6ioph002niausbtnw8zo3
cmpwh4r1502kmia40ok10lchc	cmpmcv3uk005kiausndde2tr6
cmpwh4r2302l0ia40lwcxazyq	cmpmbbun40051iaus0ypzmgo0
cmpwh4r2302l0ia40lwcxazyq	cmpmajetn004iiaus2vel52gz
cmpwh4r3102laia40upo0l73k	cmpmamcwq004viaus5y4atq5q
cmpwh4r3102laia40upo0l73k	cmpmalk2l004qiausp3pm1z6f
cmpwh4r3102laia40upo0l73k	cmpm7nh3s0036iausxm44cu9t
cmpwh4r3102laia40upo0l73k	cmpm7y2d5003uiaushuvnjj0w
cmpwh4r3602lbia402cks29dw	cmpmamcwq004viaus5y4atq5q
cmpwh4r3602lbia402cks29dw	cmpmalk2l004qiausp3pm1z6f
cmpwh4r3602lbia402cks29dw	cmpm7nh3s0036iausxm44cu9t
cmpwh4r3602lbia402cks29dw	cmpm7y2d5003uiaushuvnjj0w
cmpwh4r4502lria403wjtuy5y	cmpmalk2l004qiausp3pm1z6f
cmpwh4r4t02lzia40fyntlfg6	cmpmamcwq004viaus5y4atq5q
cmpwh4r4t02lzia40fyntlfg6	cmpmcxxg5005qiausn9g2slk7
cmpwh4r5x02mfia40mrbi2p6q	cmpmcxxg5005qiausn9g2slk7
cmpwh4r5x02mfia40mrbi2p6q	cmpmaaekm0046iausrahtxbtp
cmpwh4r5x02mfia40mrbi2p6q	cmpm4p7n6001qiausf4s5ahht
cmpwh4r5x02mfia40mrbi2p6q	cmpm7p9r4003ciausxxtm77m0
cmpwh4r6o02mnia40u1dmdbgj	cmpmalk2l004qiausp3pm1z6f
cmpwh4r6o02mnia40u1dmdbgj	cmpmcxxg5005qiausn9g2slk7
cmpwh4r6o02mnia40u1dmdbgj	cmpmaaekm0046iausrahtxbtp
cmpwh4r7702mria40hpp4y6kb	cmpm9wtav0040iaus5stdmg52
cmpwh4r7b02msia40601q9kfe	cmpm9wtav0040iaus5stdmg52
cmpwh4r8402myia40jfdizyql	cmpm7nh3s0036iausxm44cu9t
cmpwh4r8402myia40jfdizyql	cmpm7y2d5003uiaushuvnjj0w
cmpwh4r8u02n8ia408x5y52l2	cmpmajetn004iiaus2vel52gz
cmpwh4r9b02ncia40d44uhk60	cmpm7y2d5003uiaushuvnjj0w
cmpwh4r9t02ngia40t5tal3kc	cmpmbbun40051iaus0ypzmgo0
cmpwh4ral02noia40rd8oy0w2	cmpmalk2l004qiausp3pm1z6f
cmpwh4ral02noia40rd8oy0w2	cmpmcxxg5005qiausn9g2slk7
cmpwh4ral02noia40rd8oy0w2	cmpmaaekm0046iausrahtxbtp
cmpwh4rba02nwia400qijj4ak	cmpmaaekm0046iausrahtxbtp
cmpwh4rba02nwia400qijj4ak	cmpmcxxg5005qiausn9g2slk7
cmpwh4rc002o2ia408ha0dk6h	cmpmcxxg5005qiausn9g2slk7
cmpwh4rc002o2ia408ha0dk6h	cmpmaaekm0046iausrahtxbtp
cmpwh4rcq02oaia4060b4rmr9	cmpmcsydy005biaus8mz8wrn4
cmpwh4rcq02oaia4060b4rmr9	cmpmcmiud0058iaustuwfw2sp
cmpwh4rcv02obia40uppminaf	cmpmcsydy005biaus8mz8wrn4
cmpwh4rcv02obia40uppminaf	cmpmcmiud0058iaustuwfw2sp
cmpwh4rdn02ojia40ct0aav17	cmpmamcwq004viaus5y4atq5q
cmpwh4rdn02ojia40ct0aav17	cmpmalk2l004qiausp3pm1z6f
cmpwh4reb02opia40buxwnsmd	cmpmcug27005hiauszp8pd7lt
cmpwh4reb02opia40buxwnsmd	cmpm7rduc003iiausmprulwf1
cmpwh4rfv02p7ia4000hl1b1g	cmpm6ioph002niausbtnw8zo3
cmpwh4rfv02p7ia4000hl1b1g	cmpmbbun40051iaus0ypzmgo0
cmpwh4rfv02p7ia4000hl1b1g	cmpm4p7n6001qiausf4s5ahht
cmpwh4rfv02p7ia4000hl1b1g	cmpmajetn004iiaus2vel52gz
cmpwh4rfv02p7ia4000hl1b1g	cmpm7nh3s0036iausxm44cu9t
cmpwh4rh402pjia4094f720u8	cmpmaaekm0046iausrahtxbtp
cmpwh4rh402pjia4094f720u8	cmpmamcwq004viaus5y4atq5q
cmpwh4rh402pjia4094f720u8	cmpmcxxg5005qiausn9g2slk7
cmpwh4rhx02pria40sj75n76z	cmpmamcwq004viaus5y4atq5q
cmpwh4rhx02pria40sj75n76z	cmpm7q17h003fiausimucssfj
cmpwh4rhx02pria40sj75n76z	cmpmcwkjj005niausxhpwr0rq
cmpwh4rke02qbia40k9l9bsm7	cmpm70pwb002yiaus2m2fx6w0
cmpwh4rla02qpia40e74z9ob0	cmpmbbun40051iaus0ypzmgo0
cmpwh4rla02qpia40e74z9ob0	cmpmalk2l004qiausp3pm1z6f
cmpwh4rlv02qtia40ac1gd1ye	cmpm4p7n6001qiausf4s5ahht
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
941b8ccf-7be6-48c3-8599-c1f3d9f08138	e40835fff69e0576a33de64e55d9179066eb6bbed8c44ea7d8460aae4cf250d8	2026-05-28 22:06:49.991803+08	20260528193000_internal_chat		\N	2026-05-28 22:06:49.991803+08	0
b5094f68-1c87-4154-8d06-670576c2d981	8f291ec079ec4fcabde6b8f9674290ca16f7c6bb67480597907423e4f780f03e	2026-05-28 22:54:20.665876+08	20260528200000_chat_attachments		\N	2026-05-28 22:54:20.665876+08	0
42409447-b641-40d1-8436-079d977a2173	618c8550de29df2ba1dfef8ebe80ac6f95cf38f5064f3655e0d49b3bf2066733	2026-05-29 09:53:26.185864+08	20260529090000_pdf_templates		\N	2026-05-29 09:53:26.185864+08	0
02c83ad9-cfee-4d92-b2bc-ba5f07db1b9c	b21ef05bf1694509c5495e2ba3d8f0786d33afd18680b91211702715ef63ccd2	2026-05-29 10:08:48.032331+08	20260529100000_pdf_template_feature		\N	2026-05-29 10:08:48.032331+08	0
\.


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: CalendarActivity CalendarActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CalendarActivity"
    ADD CONSTRAINT "CalendarActivity_pkey" PRIMARY KEY (id);


--
-- Name: CanvasTemplate CanvasTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CanvasTemplate"
    ADD CONSTRAINT "CanvasTemplate_pkey" PRIMARY KEY (id);


--
-- Name: ChatAttachment ChatAttachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatAttachment"
    ADD CONSTRAINT "ChatAttachment_pkey" PRIMARY KEY (id);


--
-- Name: ChatChannelMember ChatChannelMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatChannelMember"
    ADD CONSTRAINT "ChatChannelMember_pkey" PRIMARY KEY (id);


--
-- Name: ChatChannel ChatChannel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatChannel"
    ADD CONSTRAINT "ChatChannel_pkey" PRIMARY KEY (id);


--
-- Name: ChatMessageRead ChatMessageRead_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessageRead"
    ADD CONSTRAINT "ChatMessageRead_pkey" PRIMARY KEY (id);


--
-- Name: ChatMessage ChatMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_pkey" PRIMARY KEY (id);


--
-- Name: ChatReaction ChatReaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatReaction"
    ADD CONSTRAINT "ChatReaction_pkey" PRIMARY KEY (id);


--
-- Name: ConvocationAssignmentHistory ConvocationAssignmentHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationAssignmentHistory"
    ADD CONSTRAINT "ConvocationAssignmentHistory_pkey" PRIMARY KEY (id);


--
-- Name: ConvocationGroupMember ConvocationGroupMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationGroupMember"
    ADD CONSTRAINT "ConvocationGroupMember_pkey" PRIMARY KEY (id);


--
-- Name: ConvocationGroup ConvocationGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationGroup"
    ADD CONSTRAINT "ConvocationGroup_pkey" PRIMARY KEY (id);


--
-- Name: ConvocationProgramItem ConvocationProgramItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationProgramItem"
    ADD CONSTRAINT "ConvocationProgramItem_pkey" PRIMARY KEY (id);


--
-- Name: ConvocationProgram ConvocationProgram_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationProgram"
    ADD CONSTRAINT "ConvocationProgram_pkey" PRIMARY KEY (id);


--
-- Name: ConvocationTemplateItem ConvocationTemplateItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationTemplateItem"
    ADD CONSTRAINT "ConvocationTemplateItem_pkey" PRIMARY KEY (id);


--
-- Name: CustomEmoji CustomEmoji_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomEmoji"
    ADD CONSTRAINT "CustomEmoji_pkey" PRIMARY KEY (id);


--
-- Name: EmployeeSeat EmployeeSeat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeSeat"
    ADD CONSTRAINT "EmployeeSeat_pkey" PRIMARY KEY (id);


--
-- Name: MapFurniture MapFurniture_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MapFurniture"
    ADD CONSTRAINT "MapFurniture_pkey" PRIMARY KEY (id);


--
-- Name: NetworkConnection NetworkConnection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NetworkConnection"
    ADD CONSTRAINT "NetworkConnection_pkey" PRIMARY KEY (id);


--
-- Name: NetworkDevice NetworkDevice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NetworkDevice"
    ADD CONSTRAINT "NetworkDevice_pkey" PRIMARY KEY (id);


--
-- Name: NetworkMap NetworkMap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NetworkMap"
    ADD CONSTRAINT "NetworkMap_pkey" PRIMARY KEY (id);


--
-- Name: PasswordResetToken PasswordResetToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY (id);


--
-- Name: PdfTemplate PdfTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PdfTemplate"
    ADD CONSTRAINT "PdfTemplate_pkey" PRIMARY KEY (id);


--
-- Name: Personnel Personnel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Personnel"
    ADD CONSTRAINT "Personnel_pkey" PRIMARY KEY (id);


--
-- Name: ProjectCycle ProjectCycle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectCycle"
    ADD CONSTRAINT "ProjectCycle_pkey" PRIMARY KEY (id);


--
-- Name: ProjectPermission ProjectPermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectPermission"
    ADD CONSTRAINT "ProjectPermission_pkey" PRIMARY KEY (id);


--
-- Name: ProjectPersonnel ProjectPersonnel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectPersonnel"
    ADD CONSTRAINT "ProjectPersonnel_pkey" PRIMARY KEY (id);


--
-- Name: ProjectRemark ProjectRemark_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectRemark"
    ADD CONSTRAINT "ProjectRemark_pkey" PRIMARY KEY (id);


--
-- Name: ProjectTask ProjectTask_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectTask"
    ADD CONSTRAINT "ProjectTask_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: RoomReservation RoomReservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RoomReservation"
    ADD CONSTRAINT "RoomReservation_pkey" PRIMARY KEY (id);


--
-- Name: Room Room_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Room"
    ADD CONSTRAINT "Room_pkey" PRIMARY KEY (id);


--
-- Name: SpecialOrderPerson SpecialOrderPerson_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialOrderPerson"
    ADD CONSTRAINT "SpecialOrderPerson_pkey" PRIMARY KEY (id);


--
-- Name: SpecialOrder SpecialOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialOrder"
    ADD CONSTRAINT "SpecialOrder_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VehicleRequestPassenger VehicleRequestPassenger_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleRequestPassenger"
    ADD CONSTRAINT "VehicleRequestPassenger_pkey" PRIMARY KEY (id);


--
-- Name: VehicleRequest VehicleRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleRequest"
    ADD CONSTRAINT "VehicleRequest_pkey" PRIMARY KEY (id);


--
-- Name: Vehicle Vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY (id);


--
-- Name: _ActivityInvolvedPersonnel _ActivityInvolvedPersonnel_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ActivityInvolvedPersonnel"
    ADD CONSTRAINT "_ActivityInvolvedPersonnel_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: AuditLog_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_entityType_entityId_idx" ON public."AuditLog" USING btree ("entityType", "entityId");


--
-- Name: AuditLog_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_userId_idx" ON public."AuditLog" USING btree ("userId");


--
-- Name: CalendarActivity_startDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CalendarActivity_startDate_idx" ON public."CalendarActivity" USING btree ("startDate");


--
-- Name: CalendarActivity_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CalendarActivity_type_idx" ON public."CalendarActivity" USING btree (type);


--
-- Name: CanvasTemplate_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CanvasTemplate_name_key" ON public."CanvasTemplate" USING btree (name);


--
-- Name: ChatAttachment_messageId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatAttachment_messageId_idx" ON public."ChatAttachment" USING btree ("messageId");


--
-- Name: ChatAttachment_mimeType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatAttachment_mimeType_idx" ON public."ChatAttachment" USING btree ("mimeType");


--
-- Name: ChatChannelMember_channelId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ChatChannelMember_channelId_userId_key" ON public."ChatChannelMember" USING btree ("channelId", "userId");


--
-- Name: ChatChannelMember_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatChannelMember_isActive_idx" ON public."ChatChannelMember" USING btree ("isActive");


--
-- Name: ChatChannelMember_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatChannelMember_userId_idx" ON public."ChatChannelMember" USING btree ("userId");


--
-- Name: ChatChannel_channelType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatChannel_channelType_idx" ON public."ChatChannel" USING btree ("channelType");


--
-- Name: ChatChannel_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatChannel_isActive_idx" ON public."ChatChannel" USING btree ("isActive");


--
-- Name: ChatChannel_name_channelType_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ChatChannel_name_channelType_key" ON public."ChatChannel" USING btree (name, "channelType");


--
-- Name: ChatMessageRead_messageId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ChatMessageRead_messageId_userId_key" ON public."ChatMessageRead" USING btree ("messageId", "userId");


--
-- Name: ChatMessageRead_readAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessageRead_readAt_idx" ON public."ChatMessageRead" USING btree ("readAt");


--
-- Name: ChatMessageRead_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessageRead_userId_idx" ON public."ChatMessageRead" USING btree ("userId");


--
-- Name: ChatMessage_channelId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessage_channelId_createdAt_idx" ON public."ChatMessage" USING btree ("channelId", "createdAt");


--
-- Name: ChatMessage_deletedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessage_deletedAt_idx" ON public."ChatMessage" USING btree ("deletedAt");


--
-- Name: ChatMessage_messageType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessage_messageType_idx" ON public."ChatMessage" USING btree ("messageType");


--
-- Name: ChatMessage_relatedEntityType_relatedEntityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessage_relatedEntityType_relatedEntityId_idx" ON public."ChatMessage" USING btree ("relatedEntityType", "relatedEntityId");


--
-- Name: ChatMessage_replyToId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessage_replyToId_idx" ON public."ChatMessage" USING btree ("replyToId");


--
-- Name: ChatMessage_senderUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatMessage_senderUserId_idx" ON public."ChatMessage" USING btree ("senderUserId");


--
-- Name: ChatReaction_customEmojiId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatReaction_customEmojiId_idx" ON public."ChatReaction" USING btree ("customEmojiId");


--
-- Name: ChatReaction_messageId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ChatReaction_messageId_idx" ON public."ChatReaction" USING btree ("messageId");


--
-- Name: ChatReaction_messageId_userId_emoji_customEmojiId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ChatReaction_messageId_userId_emoji_customEmojiId_key" ON public."ChatReaction" USING btree ("messageId", "userId", emoji, "customEmojiId");


--
-- Name: ConvocationAssignmentHistory_convocationDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationAssignmentHistory_convocationDate_idx" ON public."ConvocationAssignmentHistory" USING btree ("convocationDate");


--
-- Name: ConvocationAssignmentHistory_groupId_rotationKey_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationAssignmentHistory_groupId_rotationKey_idx" ON public."ConvocationAssignmentHistory" USING btree ("groupId", "rotationKey");


--
-- Name: ConvocationAssignmentHistory_personnelId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationAssignmentHistory_personnelId_idx" ON public."ConvocationAssignmentHistory" USING btree ("personnelId");


--
-- Name: ConvocationAssignmentHistory_programId_rotationKey_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ConvocationAssignmentHistory_programId_rotationKey_key" ON public."ConvocationAssignmentHistory" USING btree ("programId", "rotationKey");


--
-- Name: ConvocationGroupMember_groupId_personnelId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ConvocationGroupMember_groupId_personnelId_key" ON public."ConvocationGroupMember" USING btree ("groupId", "personnelId");


--
-- Name: ConvocationGroupMember_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationGroupMember_isActive_idx" ON public."ConvocationGroupMember" USING btree ("isActive");


--
-- Name: ConvocationGroupMember_isAvailable_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationGroupMember_isAvailable_idx" ON public."ConvocationGroupMember" USING btree ("isAvailable");


--
-- Name: ConvocationGroupMember_personnelId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationGroupMember_personnelId_idx" ON public."ConvocationGroupMember" USING btree ("personnelId");


--
-- Name: ConvocationGroup_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationGroup_isActive_idx" ON public."ConvocationGroup" USING btree ("isActive");


--
-- Name: ConvocationGroup_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ConvocationGroup_name_key" ON public."ConvocationGroup" USING btree (name);


--
-- Name: ConvocationGroup_sortOrder_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationGroup_sortOrder_idx" ON public."ConvocationGroup" USING btree ("sortOrder");


--
-- Name: ConvocationProgramItem_assignedPersonnelId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationProgramItem_assignedPersonnelId_idx" ON public."ConvocationProgramItem" USING btree ("assignedPersonnelId");


--
-- Name: ConvocationProgramItem_itemOrder_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationProgramItem_itemOrder_idx" ON public."ConvocationProgramItem" USING btree ("itemOrder");


--
-- Name: ConvocationProgramItem_programId_itemKey_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ConvocationProgramItem_programId_itemKey_key" ON public."ConvocationProgramItem" USING btree ("programId", "itemKey");


--
-- Name: ConvocationProgram_convocationDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationProgram_convocationDate_idx" ON public."ConvocationProgram" USING btree ("convocationDate");


--
-- Name: ConvocationProgram_convocationDate_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ConvocationProgram_convocationDate_key" ON public."ConvocationProgram" USING btree ("convocationDate");


--
-- Name: ConvocationProgram_groupId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationProgram_groupId_idx" ON public."ConvocationProgram" USING btree ("groupId");


--
-- Name: ConvocationProgram_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationProgram_status_idx" ON public."ConvocationProgram" USING btree (status);


--
-- Name: ConvocationTemplateItem_isEnabled_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationTemplateItem_isEnabled_idx" ON public."ConvocationTemplateItem" USING btree ("isEnabled");


--
-- Name: ConvocationTemplateItem_itemKey_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ConvocationTemplateItem_itemKey_key" ON public."ConvocationTemplateItem" USING btree ("itemKey");


--
-- Name: ConvocationTemplateItem_itemOrder_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ConvocationTemplateItem_itemOrder_idx" ON public."ConvocationTemplateItem" USING btree ("itemOrder");


--
-- Name: CustomEmoji_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CustomEmoji_name_idx" ON public."CustomEmoji" USING btree (name);


--
-- Name: CustomEmoji_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CustomEmoji_name_key" ON public."CustomEmoji" USING btree (name);


--
-- Name: EmployeeSeat_mapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EmployeeSeat_mapId_idx" ON public."EmployeeSeat" USING btree ("mapId");


--
-- Name: EmployeeSeat_personnelId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EmployeeSeat_personnelId_idx" ON public."EmployeeSeat" USING btree ("personnelId");


--
-- Name: MapFurniture_mapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MapFurniture_mapId_idx" ON public."MapFurniture" USING btree ("mapId");


--
-- Name: NetworkConnection_mapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NetworkConnection_mapId_idx" ON public."NetworkConnection" USING btree ("mapId");


--
-- Name: NetworkConnection_sourceDeviceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NetworkConnection_sourceDeviceId_idx" ON public."NetworkConnection" USING btree ("sourceDeviceId");


--
-- Name: NetworkConnection_targetDeviceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NetworkConnection_targetDeviceId_idx" ON public."NetworkConnection" USING btree ("targetDeviceId");


--
-- Name: NetworkDevice_mapId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NetworkDevice_mapId_idx" ON public."NetworkDevice" USING btree ("mapId");


--
-- Name: NetworkDevice_personnelId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NetworkDevice_personnelId_idx" ON public."NetworkDevice" USING btree ("personnelId");


--
-- Name: NetworkDevice_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NetworkDevice_status_idx" ON public."NetworkDevice" USING btree (status);


--
-- Name: NetworkDevice_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NetworkDevice_type_idx" ON public."NetworkDevice" USING btree (type);


--
-- Name: NetworkMap_createdById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NetworkMap_createdById_idx" ON public."NetworkMap" USING btree ("createdById");


--
-- Name: NetworkMap_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NetworkMap_isActive_idx" ON public."NetworkMap" USING btree ("isActive");


--
-- Name: PasswordResetToken_tokenHash_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PasswordResetToken_tokenHash_idx" ON public."PasswordResetToken" USING btree ("tokenHash");


--
-- Name: PasswordResetToken_tokenHash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON public."PasswordResetToken" USING btree ("tokenHash");


--
-- Name: PasswordResetToken_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PasswordResetToken_userId_idx" ON public."PasswordResetToken" USING btree ("userId");


--
-- Name: PdfTemplate_createdById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PdfTemplate_createdById_idx" ON public."PdfTemplate" USING btree ("createdById");


--
-- Name: PdfTemplate_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PdfTemplate_isActive_idx" ON public."PdfTemplate" USING btree ("isActive");


--
-- Name: PdfTemplate_templateFeature_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PdfTemplate_templateFeature_idx" ON public."PdfTemplate" USING btree ("templateFeature");


--
-- Name: Personnel_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Personnel_email_key" ON public."Personnel" USING btree (email);


--
-- Name: Personnel_employeeNo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Personnel_employeeNo_key" ON public."Personnel" USING btree ("employeeNo");


--
-- Name: Personnel_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Personnel_isActive_idx" ON public."Personnel" USING btree ("isActive");


--
-- Name: Personnel_section_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Personnel_section_idx" ON public."Personnel" USING btree (section);


--
-- Name: Personnel_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Personnel_slug_key" ON public."Personnel" USING btree (slug);


--
-- Name: ProjectCycle_deadline_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectCycle_deadline_idx" ON public."ProjectCycle" USING btree (deadline);


--
-- Name: ProjectCycle_projectId_cycleName_year_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProjectCycle_projectId_cycleName_year_key" ON public."ProjectCycle" USING btree ("projectId", "cycleName", year);


--
-- Name: ProjectCycle_projectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectCycle_projectId_idx" ON public."ProjectCycle" USING btree ("projectId");


--
-- Name: ProjectCycle_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectCycle_status_idx" ON public."ProjectCycle" USING btree (status);


--
-- Name: ProjectPermission_projectId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProjectPermission_projectId_userId_key" ON public."ProjectPermission" USING btree ("projectId", "userId");


--
-- Name: ProjectPermission_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectPermission_userId_idx" ON public."ProjectPermission" USING btree ("userId");


--
-- Name: ProjectPersonnel_isFocalPerson_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectPersonnel_isFocalPerson_idx" ON public."ProjectPersonnel" USING btree ("isFocalPerson");


--
-- Name: ProjectPersonnel_personnelId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectPersonnel_personnelId_idx" ON public."ProjectPersonnel" USING btree ("personnelId");


--
-- Name: ProjectPersonnel_projectId_personnelId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProjectPersonnel_projectId_personnelId_key" ON public."ProjectPersonnel" USING btree ("projectId", "personnelId");


--
-- Name: ProjectRemark_authorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectRemark_authorId_idx" ON public."ProjectRemark" USING btree ("authorId");


--
-- Name: ProjectRemark_projectCycleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectRemark_projectCycleId_idx" ON public."ProjectRemark" USING btree ("projectCycleId");


--
-- Name: ProjectRemark_projectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectRemark_projectId_idx" ON public."ProjectRemark" USING btree ("projectId");


--
-- Name: ProjectRemark_taskId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectRemark_taskId_idx" ON public."ProjectRemark" USING btree ("taskId");


--
-- Name: ProjectTask_assignedPersonnelId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectTask_assignedPersonnelId_idx" ON public."ProjectTask" USING btree ("assignedPersonnelId");


--
-- Name: ProjectTask_deadline_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectTask_deadline_idx" ON public."ProjectTask" USING btree (deadline);


--
-- Name: ProjectTask_projectCycleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectTask_projectCycleId_idx" ON public."ProjectTask" USING btree ("projectCycleId");


--
-- Name: ProjectTask_projectCycleId_taskName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProjectTask_projectCycleId_taskName_key" ON public."ProjectTask" USING btree ("projectCycleId", "taskName");


--
-- Name: ProjectTask_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProjectTask_status_idx" ON public."ProjectTask" USING btree (status);


--
-- Name: Project_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Project_category_idx" ON public."Project" USING btree (category);


--
-- Name: Project_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Project_code_key" ON public."Project" USING btree (code);


--
-- Name: Project_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Project_isActive_idx" ON public."Project" USING btree ("isActive");


--
-- Name: Project_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Project_slug_key" ON public."Project" USING btree (slug);


--
-- Name: Project_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Project_status_idx" ON public."Project" USING btree (status);


--
-- Name: Project_year_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Project_year_idx" ON public."Project" USING btree (year);


--
-- Name: RoomReservation_endDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RoomReservation_endDate_idx" ON public."RoomReservation" USING btree ("endDate");


--
-- Name: RoomReservation_requestedByUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RoomReservation_requestedByUserId_idx" ON public."RoomReservation" USING btree ("requestedByUserId");


--
-- Name: RoomReservation_requesterPersonnelId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RoomReservation_requesterPersonnelId_idx" ON public."RoomReservation" USING btree ("requesterPersonnelId");


--
-- Name: RoomReservation_roomId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RoomReservation_roomId_idx" ON public."RoomReservation" USING btree ("roomId");


--
-- Name: RoomReservation_startDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RoomReservation_startDate_idx" ON public."RoomReservation" USING btree ("startDate");


--
-- Name: RoomReservation_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RoomReservation_status_idx" ON public."RoomReservation" USING btree (status);


--
-- Name: Room_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Room_isActive_idx" ON public."Room" USING btree ("isActive");


--
-- Name: Room_isAvailable_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Room_isAvailable_idx" ON public."Room" USING btree ("isAvailable");


--
-- Name: Room_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Room_name_key" ON public."Room" USING btree (name);


--
-- Name: SpecialOrderPerson_matchStatus_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SpecialOrderPerson_matchStatus_idx" ON public."SpecialOrderPerson" USING btree ("matchStatus");


--
-- Name: SpecialOrderPerson_personnelId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SpecialOrderPerson_personnelId_idx" ON public."SpecialOrderPerson" USING btree ("personnelId");


--
-- Name: SpecialOrderPerson_specialOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SpecialOrderPerson_specialOrderId_idx" ON public."SpecialOrderPerson" USING btree ("specialOrderId");


--
-- Name: SpecialOrder_activityDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SpecialOrder_activityDate_idx" ON public."SpecialOrder" USING btree ("activityDate");


--
-- Name: SpecialOrder_locationType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SpecialOrder_locationType_idx" ON public."SpecialOrder" USING btree ("locationType");


--
-- Name: SpecialOrder_referenceNo_soNumber_purpose_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SpecialOrder_referenceNo_soNumber_purpose_key" ON public."SpecialOrder" USING btree ("referenceNo", "soNumber", purpose);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_isActive_idx" ON public."User" USING btree ("isActive");


--
-- Name: User_personnelId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_personnelId_key" ON public."User" USING btree ("personnelId");


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: VehicleRequestPassenger_personnelId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "VehicleRequestPassenger_personnelId_idx" ON public."VehicleRequestPassenger" USING btree ("personnelId");


--
-- Name: VehicleRequestPassenger_requestId_personnelId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VehicleRequestPassenger_requestId_personnelId_key" ON public."VehicleRequestPassenger" USING btree ("requestId", "personnelId");


--
-- Name: VehicleRequest_assignedVehicleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "VehicleRequest_assignedVehicleId_idx" ON public."VehicleRequest" USING btree ("assignedVehicleId");


--
-- Name: VehicleRequest_requestedByUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "VehicleRequest_requestedByUserId_idx" ON public."VehicleRequest" USING btree ("requestedByUserId");


--
-- Name: VehicleRequest_requesterPersonnelId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "VehicleRequest_requesterPersonnelId_idx" ON public."VehicleRequest" USING btree ("requesterPersonnelId");


--
-- Name: VehicleRequest_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "VehicleRequest_status_idx" ON public."VehicleRequest" USING btree (status);


--
-- Name: VehicleRequest_travelDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "VehicleRequest_travelDate_idx" ON public."VehicleRequest" USING btree ("travelDate");


--
-- Name: Vehicle_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Vehicle_isActive_idx" ON public."Vehicle" USING btree ("isActive");


--
-- Name: Vehicle_plateNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON public."Vehicle" USING btree ("plateNumber");


--
-- Name: _ActivityInvolvedPersonnel_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ActivityInvolvedPersonnel_B_index" ON public."_ActivityInvolvedPersonnel" USING btree ("B");


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CalendarActivity CalendarActivity_personnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CalendarActivity"
    ADD CONSTRAINT "CalendarActivity_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatAttachment ChatAttachment_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatAttachment"
    ADD CONSTRAINT "ChatAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."ChatMessage"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatChannelMember ChatChannelMember_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatChannelMember"
    ADD CONSTRAINT "ChatChannelMember_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."ChatChannel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatChannelMember ChatChannelMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatChannelMember"
    ADD CONSTRAINT "ChatChannelMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatChannel ChatChannel_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatChannel"
    ADD CONSTRAINT "ChatChannel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatMessageRead ChatMessageRead_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessageRead"
    ADD CONSTRAINT "ChatMessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."ChatMessage"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatMessageRead ChatMessageRead_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessageRead"
    ADD CONSTRAINT "ChatMessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatMessage ChatMessage_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."ChatChannel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatMessage ChatMessage_replyToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES public."ChatMessage"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatMessage ChatMessage_senderUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatReaction ChatReaction_customEmojiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatReaction"
    ADD CONSTRAINT "ChatReaction_customEmojiId_fkey" FOREIGN KEY ("customEmojiId") REFERENCES public."CustomEmoji"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatReaction ChatReaction_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatReaction"
    ADD CONSTRAINT "ChatReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public."ChatMessage"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatReaction ChatReaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ChatReaction"
    ADD CONSTRAINT "ChatReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ConvocationAssignmentHistory ConvocationAssignmentHistory_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationAssignmentHistory"
    ADD CONSTRAINT "ConvocationAssignmentHistory_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."ConvocationGroup"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ConvocationAssignmentHistory ConvocationAssignmentHistory_personnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationAssignmentHistory"
    ADD CONSTRAINT "ConvocationAssignmentHistory_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ConvocationAssignmentHistory ConvocationAssignmentHistory_programId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationAssignmentHistory"
    ADD CONSTRAINT "ConvocationAssignmentHistory_programId_fkey" FOREIGN KEY ("programId") REFERENCES public."ConvocationProgram"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ConvocationGroupMember ConvocationGroupMember_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationGroupMember"
    ADD CONSTRAINT "ConvocationGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."ConvocationGroup"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ConvocationGroupMember ConvocationGroupMember_personnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationGroupMember"
    ADD CONSTRAINT "ConvocationGroupMember_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ConvocationProgramItem ConvocationProgramItem_assignedPersonnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationProgramItem"
    ADD CONSTRAINT "ConvocationProgramItem_assignedPersonnelId_fkey" FOREIGN KEY ("assignedPersonnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ConvocationProgramItem ConvocationProgramItem_programId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationProgramItem"
    ADD CONSTRAINT "ConvocationProgramItem_programId_fkey" FOREIGN KEY ("programId") REFERENCES public."ConvocationProgram"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ConvocationProgram ConvocationProgram_calendarActivityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationProgram"
    ADD CONSTRAINT "ConvocationProgram_calendarActivityId_fkey" FOREIGN KEY ("calendarActivityId") REFERENCES public."CalendarActivity"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ConvocationProgram ConvocationProgram_finalizedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationProgram"
    ADD CONSTRAINT "ConvocationProgram_finalizedById_fkey" FOREIGN KEY ("finalizedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ConvocationProgram ConvocationProgram_generatedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationProgram"
    ADD CONSTRAINT "ConvocationProgram_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ConvocationProgram ConvocationProgram_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ConvocationProgram"
    ADD CONSTRAINT "ConvocationProgram_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."ConvocationGroup"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CustomEmoji CustomEmoji_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomEmoji"
    ADD CONSTRAINT "CustomEmoji_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EmployeeSeat EmployeeSeat_furnitureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeSeat"
    ADD CONSTRAINT "EmployeeSeat_furnitureId_fkey" FOREIGN KEY ("furnitureId") REFERENCES public."MapFurniture"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EmployeeSeat EmployeeSeat_mapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeSeat"
    ADD CONSTRAINT "EmployeeSeat_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES public."NetworkMap"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmployeeSeat EmployeeSeat_personnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeSeat"
    ADD CONSTRAINT "EmployeeSeat_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MapFurniture MapFurniture_mapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MapFurniture"
    ADD CONSTRAINT "MapFurniture_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES public."NetworkMap"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NetworkConnection NetworkConnection_mapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NetworkConnection"
    ADD CONSTRAINT "NetworkConnection_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES public."NetworkMap"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NetworkConnection NetworkConnection_sourceDeviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NetworkConnection"
    ADD CONSTRAINT "NetworkConnection_sourceDeviceId_fkey" FOREIGN KEY ("sourceDeviceId") REFERENCES public."NetworkDevice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NetworkConnection NetworkConnection_targetDeviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NetworkConnection"
    ADD CONSTRAINT "NetworkConnection_targetDeviceId_fkey" FOREIGN KEY ("targetDeviceId") REFERENCES public."NetworkDevice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NetworkDevice NetworkDevice_employeeSeatId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NetworkDevice"
    ADD CONSTRAINT "NetworkDevice_employeeSeatId_fkey" FOREIGN KEY ("employeeSeatId") REFERENCES public."EmployeeSeat"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: NetworkDevice NetworkDevice_furnitureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NetworkDevice"
    ADD CONSTRAINT "NetworkDevice_furnitureId_fkey" FOREIGN KEY ("furnitureId") REFERENCES public."MapFurniture"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: NetworkDevice NetworkDevice_mapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NetworkDevice"
    ADD CONSTRAINT "NetworkDevice_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES public."NetworkMap"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NetworkDevice NetworkDevice_personnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NetworkDevice"
    ADD CONSTRAINT "NetworkDevice_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: NetworkMap NetworkMap_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NetworkMap"
    ADD CONSTRAINT "NetworkMap_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PasswordResetToken PasswordResetToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PdfTemplate PdfTemplate_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PdfTemplate"
    ADD CONSTRAINT "PdfTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProjectCycle ProjectCycle_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectCycle"
    ADD CONSTRAINT "ProjectCycle_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectPermission ProjectPermission_assignedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectPermission"
    ADD CONSTRAINT "ProjectPermission_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProjectPermission ProjectPermission_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectPermission"
    ADD CONSTRAINT "ProjectPermission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectPermission ProjectPermission_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectPermission"
    ADD CONSTRAINT "ProjectPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectPersonnel ProjectPersonnel_personnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectPersonnel"
    ADD CONSTRAINT "ProjectPersonnel_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectPersonnel ProjectPersonnel_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectPersonnel"
    ADD CONSTRAINT "ProjectPersonnel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectRemark ProjectRemark_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectRemark"
    ADD CONSTRAINT "ProjectRemark_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectRemark ProjectRemark_projectCycleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectRemark"
    ADD CONSTRAINT "ProjectRemark_projectCycleId_fkey" FOREIGN KEY ("projectCycleId") REFERENCES public."ProjectCycle"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectRemark ProjectRemark_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectRemark"
    ADD CONSTRAINT "ProjectRemark_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectRemark ProjectRemark_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectRemark"
    ADD CONSTRAINT "ProjectRemark_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."ProjectTask"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectTask ProjectTask_assignedPersonnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectTask"
    ADD CONSTRAINT "ProjectTask_assignedPersonnelId_fkey" FOREIGN KEY ("assignedPersonnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProjectTask ProjectTask_projectCycleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProjectTask"
    ADD CONSTRAINT "ProjectTask_projectCycleId_fkey" FOREIGN KEY ("projectCycleId") REFERENCES public."ProjectCycle"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Project Project_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Project Project_updatedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RoomReservation RoomReservation_approvedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RoomReservation"
    ADD CONSTRAINT "RoomReservation_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RoomReservation RoomReservation_calendarActivityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RoomReservation"
    ADD CONSTRAINT "RoomReservation_calendarActivityId_fkey" FOREIGN KEY ("calendarActivityId") REFERENCES public."CalendarActivity"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RoomReservation RoomReservation_rejectedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RoomReservation"
    ADD CONSTRAINT "RoomReservation_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RoomReservation RoomReservation_requestedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RoomReservation"
    ADD CONSTRAINT "RoomReservation_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RoomReservation RoomReservation_requesterPersonnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RoomReservation"
    ADD CONSTRAINT "RoomReservation_requesterPersonnelId_fkey" FOREIGN KEY ("requesterPersonnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RoomReservation RoomReservation_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RoomReservation"
    ADD CONSTRAINT "RoomReservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public."Room"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SpecialOrderPerson SpecialOrderPerson_personnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialOrderPerson"
    ADD CONSTRAINT "SpecialOrderPerson_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SpecialOrderPerson SpecialOrderPerson_specialOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialOrderPerson"
    ADD CONSTRAINT "SpecialOrderPerson_specialOrderId_fkey" FOREIGN KEY ("specialOrderId") REFERENCES public."SpecialOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SpecialOrder SpecialOrder_calendarActivityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpecialOrder"
    ADD CONSTRAINT "SpecialOrder_calendarActivityId_fkey" FOREIGN KEY ("calendarActivityId") REFERENCES public."CalendarActivity"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_personnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VehicleRequestPassenger VehicleRequestPassenger_personnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleRequestPassenger"
    ADD CONSTRAINT "VehicleRequestPassenger_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VehicleRequestPassenger VehicleRequestPassenger_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleRequestPassenger"
    ADD CONSTRAINT "VehicleRequestPassenger_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public."VehicleRequest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VehicleRequest VehicleRequest_assignedVehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleRequest"
    ADD CONSTRAINT "VehicleRequest_assignedVehicleId_fkey" FOREIGN KEY ("assignedVehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VehicleRequest VehicleRequest_calendarActivityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleRequest"
    ADD CONSTRAINT "VehicleRequest_calendarActivityId_fkey" FOREIGN KEY ("calendarActivityId") REFERENCES public."CalendarActivity"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VehicleRequest VehicleRequest_requestedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleRequest"
    ADD CONSTRAINT "VehicleRequest_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VehicleRequest VehicleRequest_requesterPersonnelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleRequest"
    ADD CONSTRAINT "VehicleRequest_requesterPersonnelId_fkey" FOREIGN KEY ("requesterPersonnelId") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VehicleRequest VehicleRequest_reviewedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleRequest"
    ADD CONSTRAINT "VehicleRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _ActivityInvolvedPersonnel _ActivityInvolvedPersonnel_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ActivityInvolvedPersonnel"
    ADD CONSTRAINT "_ActivityInvolvedPersonnel_A_fkey" FOREIGN KEY ("A") REFERENCES public."CalendarActivity"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ActivityInvolvedPersonnel _ActivityInvolvedPersonnel_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ActivityInvolvedPersonnel"
    ADD CONSTRAINT "_ActivityInvolvedPersonnel_B_fkey" FOREIGN KEY ("B") REFERENCES public."Personnel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 6d4T4zL55TFKqhH2dDONPn3B5UBGd6SoSUj2eqRvOB2zIr82A04eEAxaZ4YsQaL

