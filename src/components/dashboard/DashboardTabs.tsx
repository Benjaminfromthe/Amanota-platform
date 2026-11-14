'use client';

import { useState } from 'react';
import LessonCard from './LessonCard';
import EscrowBanner from './EscrowBanner';
import { useApp } from '@/context/AppContext';
import type { AppLesson, Booking } from '@/context/AppContext';
import type { Lesson } from '@/lib/data';

type Tab = 'lessons' | 'sessions' | 'history';

function appLessonToLesson(l: AppLesson): Lesson {
  return {
    id: l.id,
    courseCode: l.courseCode,
    courseCodeColor: l.courseCodeColor,
    faculty: l.faculty,
    title: l.title,
    description: l.description,
    duration: l.duration,
    progress: 100,
    status: 'completed',
    instructor: l.instructor,
    assets: l.assets,
    thumbnail: l.thumbnail,
    thumbnailAlt: l.thumbnailAlt,
  };
}

function BookingCard({
  booking,
  lessons,
  onComplete,
}: {
  booking: Booking;
  lessons: AppLesson[];
  onComplete: () => void;
}) {
  const lesson = lessons.find((l) => l.id === booking.lessonId);
  const isCompleted = booking.status === 'completed';

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: '1rem',
        padding: '1.25rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '0.125rem 0.5rem',
              borderRadius: '0.375rem',
              backgroundColor:
                booking.tier === 'campus'
                  ? 'var(--color-primary-fixed)'
                  : 'var(--color-secondary-container)',
              color:
                booking.tier === 'campus'
                  ? 'var(--color-primary)'
                  : 'var(--color-on-secondary-container)',
              fontFamily: 'var(--font-label)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {booking.tier}
          </span>
          {isCompleted && (
            <span
              style={{
                padding: '0.125rem 0.5rem',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--color-secondary-container)',
                color: 'var(--color-on-secondary-container)',
                fontFamily: 'var(--font-label)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>
                check_circle
              </span>
              Completed
            </span>
          )}
        </div>
        <h4
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--color-on-surface)',
            margin: '0 0 0.25rem',
          }}
        >
          {lesson?.title ?? booking.lessonId}
        </h4>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'var(--color-on-surface-variant)',
            margin: '0 0 0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            flexWrap: 'wrap',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--color-outline)' }}>
            calendar_today
          </span>
          {booking.scheduledDate}
          {booking.scheduledTime && (
            <>
              <span style={{ color: 'var(--color-outline)' }}>•</span>
              {booking.scheduledTime}
            </>
          )}
          {booking.location && (
            <>
              <span style={{ color: 'var(--color-outline)' }}>•</span>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--color-outline)' }}>
                location_on
              </span>
              {booking.location}
            </>
          )}
        </p>
        {lesson && (
          <p
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.75rem',
              color: 'var(--color-on-surface-variant)',
              margin: 0,
            }}
          >
            Instructor: {lesson.instructor.name}
          </p>
        )}
      </div>
      {!isCompleted && (
        <button
          onClick={onComplete}
          style={{
            flexShrink: 0,
            padding: '0.5rem 1rem',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-on-secondary)',
            fontFamily: 'var(--font-label)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            transition: 'background 0.15s',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
            task_alt
          </span>
          Mark Session Completed
        </button>
      )}
    </div>
  );
}

export default function DashboardTabs() {
  const { lessons: appLessons, purchases, bookings, markBookingCompleted } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('lessons');

  const unlockedLessons = purchases
    .filter((p) => p.tier === 'recorded')
    .map((p) => appLessons.find((l) => l.id === p.lessonId))
    .filter((l): l is AppLesson => !!l);

  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');
  const pastBookings = bookings.filter((b) => b.status === 'completed');

  const tabs: { id: Tab; label: string; icon: string; badge: React.ReactNode }[] = [
    {
      id: 'lessons',
      label: 'Unlocked Recorded Lessons',
      icon: 'play_lesson',
      badge: (
        <span
          style={{
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            backgroundColor: 'white',
            color: 'var(--color-primary)',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}
        >
          {unlockedLessons.length}
        </span>
      ),
    },
    {
      id: 'sessions',
      label: 'Upcoming Tutoring Sessions',
      icon: 'event_upcoming',
      badge: (
        <span
          style={{
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
            fontSize: '0.7rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.125rem',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '0.8rem' }}>
            verified_user
          </span>
          Escrow Protected ({upcomingBookings.length})
        </span>
      ),
    },
    {
      id: 'history',
      label: 'Past Sessions & Notes',
      icon: 'history_edu',
      badge: (
        <span
          style={{
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-surface-container)',
            color: 'var(--color-on-surface-variant)',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}
        >
          {pastBookings.length}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: 'var(--color-surface-container-lowest)',
          padding: '0.5rem',
          borderRadius: '1rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', overflowX: 'auto' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  boxShadow: isActive ? '0 1px 4px rgba(53,37,205,0.2)' : 'none',
                  transition: 'background 0.15s, color 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      'var(--color-surface-container)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-on-surface)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color =
                      'var(--color-on-surface-variant)';
                  }
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge}
              </button>
            );
          })}
        </div>

        {/* Filter (desktop only) */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <input
            type="text"
            placeholder="Filter my courses..."
            style={{
              paddingLeft: '2.25rem',
              paddingRight: '0.75rem',
              paddingTop: '0.375rem',
              paddingBottom: '0.375rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              backgroundColor: 'var(--color-surface-container-low)',
              border: 'none',
              borderRadius: '0.5rem',
              outline: 'none',
              width: '13rem',
              color: 'var(--color-on-surface)',
            }}
          />
          <span
            className="material-symbols-outlined"
            style={{
              position: 'absolute',
              left: '0.625rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-outline)',
              fontSize: '1.1rem',
              pointerEvents: 'none',
            }}
          >
            filter_list
          </span>
        </div>
      </div>

      {/* TAB 1: Unlocked Lessons */}
      {activeTab === 'lessons' && (
        <div>
          {/* Info bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              backgroundColor: 'rgba(226,223,255,0.35)',
              borderRadius: '1rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: 'var(--color-on-primary)', fontSize: '1.375rem' }}
                >
                  verified
                </span>
              </div>
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--color-on-surface)',
                    margin: 0,
                  }}
                >
                  1,000 RWF Micro-Course Purchases
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--color-on-surface-variant)',
                    margin: 0,
                  }}
                >
                  Permanent lecture playback with complete localized code examples and printable AUCA
                  summaries.
                </p>
              </div>
            </div>
          </div>

          {unlockedLessons.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                backgroundColor: 'var(--color-surface-container-lowest)',
                borderRadius: '1rem',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '3rem', color: 'var(--color-outline)', display: 'block', marginBottom: '1rem' }}
              >
                play_lesson
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                No lessons yet —{' '}
                <a href="/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  explore the feed
                </a>
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
              }}
            >
              {unlockedLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={appLessonToLesson(lesson)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Upcoming Sessions */}
      {activeTab === 'sessions' && (
        <div>
          <EscrowBanner />
          {upcomingBookings.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                backgroundColor: 'var(--color-surface-container-lowest)',
                borderRadius: '1rem',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '3rem', color: 'var(--color-outline)', display: 'block', marginBottom: '1rem' }}
              >
                event_upcoming
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                No upcoming sessions
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  lessons={appLessons}
                  onComplete={() => markBookingCompleted(booking.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Past Sessions */}
      {activeTab === 'history' && (
        <div>
          {pastBookings.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                borderRadius: '1rem',
                padding: '3rem',
                textAlign: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '3rem', color: 'var(--color-outline)', display: 'block', marginBottom: '1rem' }}
              >
                history_edu
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--color-on-surface)',
                  marginBottom: '0.5rem',
                }}
              >
                No past sessions yet
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                Your session history, notes, and downloadable transcripts will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pastBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  lessons={appLessons}
                  onComplete={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
