'use client';

import { useState } from 'react';
import { BookOpen, CalendarDays, History, ShieldCheck, CheckCircle2, Calendar, MapPin, SlidersHorizontal, PlayCircle, Monitor } from 'lucide-react';
import LessonCard from './LessonCard';
import EscrowBanner from './EscrowBanner';
import { useApp } from '@/context/AppContext';
import type { AppLesson, Booking } from '@/context/AppContext';
import type { Lesson } from '@/lib/data';

type Tab = 'lessons' | 'sessions' | 'history';

function appLessonToLesson(l: AppLesson): Lesson {
  return {
    id: l.id, courseCode: l.courseCode, courseCodeColor: l.courseCodeColor,
    faculty: l.faculty, title: l.title, description: l.description, duration: l.duration,
    progress: 100, status: 'completed', instructor: l.instructor,
    assets: l.assets, thumbnail: l.thumbnail, thumbnailAlt: l.thumbnailAlt,
  };
}

function BookingCard({ booking, lessons, onComplete }: { booking: Booking; lessons: AppLesson[]; onComplete: () => void }) {
  const lesson      = lessons.find((l) => l.id === booking.lessonId);
  const isCompleted = booking.status === 'completed';

  return (
    <div style={{ backgroundColor: 'white', border: '1px solid var(--color-outline-variant)', borderRadius: '0.75rem', padding: '1.125rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.125rem 0.5rem', borderRadius: '0.3rem', backgroundColor: booking.tier === 'campus' ? 'var(--color-primary-fixed)' : 'var(--color-secondary-container)', color: booking.tier === 'campus' ? 'var(--color-primary)' : 'var(--color-on-secondary-container)', fontFamily: 'var(--font-label)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
            {booking.tier}
          </span>
          {isCompleted && (
            <span style={{ padding: '0.125rem 0.5rem', borderRadius: '0.3rem', backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', fontFamily: 'var(--font-label)', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.1875rem' }}>
              <CheckCircle2 size={10} /> Completed
            </span>
          )}
        </div>
        <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 0.25rem' }}>
          {lesson?.title ?? booking.lessonId}
        </h4>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-on-surface-variant)', margin: '0 0 0.375rem', display: 'flex', alignItems: 'center', gap: '0.3125rem', flexWrap: 'wrap' }}>
          <Calendar size={13} color="var(--color-outline)" />
          {booking.scheduledDate}
          {booking.scheduledTime && (<><span style={{ color: 'var(--color-outline)' }}>·</span>{booking.scheduledTime}</>)}
          {booking.location && (<><span style={{ color: 'var(--color-outline)' }}>·</span><MapPin size={13} color="var(--color-outline)" />{booking.location}</>)}
        </p>
        {lesson && (
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', color: 'var(--color-on-surface-variant)', margin: 0 }}>
            Instructor: {lesson.instructor.name}
          </p>
        )}
      </div>
      {!isCompleted && (
        <button onClick={onComplete} style={{ flexShrink: 0, padding: '0.5rem 0.875rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)', fontFamily: 'var(--font-label)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3125rem' }}>
          <CheckCircle2 size={14} /> Mark Session Completed
        </button>
      )}
    </div>
  );
}

export default function DashboardTabs() {
  const { lessons: appLessons, purchases, bookings, markBookingCompleted } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('lessons');
  const [filterVal, setFilterVal] = useState('');

  const unlockedLessons  = purchases.filter((p) => p.tier === 'recorded').map((p) => appLessons.find((l) => l.id === p.lessonId)).filter((l): l is AppLesson => !!l);
  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');
  const pastBookings     = bookings.filter((b) => b.status === 'completed');

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'lessons',  label: 'Unlocked Lessons',         icon: <BookOpen size={16} />,      count: unlockedLessons.length },
    { id: 'sessions', label: 'Upcoming Sessions',         icon: <CalendarDays size={16} />,  count: upcomingBookings.length },
    { id: 'history',  label: 'Past Sessions & Notes',     icon: <History size={16} />,       count: pastBookings.length },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', backgroundColor: 'white', border: '1px solid var(--color-outline-variant)', padding: '0.4375rem', borderRadius: '0.875rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4375rem', padding: '0.5625rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: isActive ? 'var(--color-primary)' : 'transparent', color: isActive ? 'white' : 'var(--color-on-surface-variant)', fontFamily: 'var(--font-label)', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-surface-container)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-on-surface)'; } }}
                onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-on-surface-variant)'; } }}
              >
                {tab.icon}
                {tab.label}
                <span style={{ padding: '0.0625rem 0.4375rem', borderRadius: '9999px', backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-surface-container)', color: isActive ? 'white' : 'var(--color-on-surface-variant)', fontSize: '0.7rem', fontWeight: 700 }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        {/* Filter input */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <SlidersHorizontal size={15} color="var(--color-outline)" style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input type="text" placeholder="Filter courses…" value={filterVal} onChange={(e) => setFilterVal(e.target.value)}
            style={{ paddingLeft: '2.125rem', paddingRight: '0.75rem', paddingTop: '0.4375rem', paddingBottom: '0.4375rem', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', backgroundColor: 'var(--color-surface-container-low)', border: 'none', borderRadius: '0.5rem', outline: 'none', width: '12rem', color: 'var(--color-on-surface)' }}
          />
        </div>
      </div>

      {/* TAB 1: Unlocked Lessons */}
      {activeTab === 'lessons' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', backgroundColor: 'rgba(226,223,255,0.3)', border: '1px solid rgba(53,37,205,0.1)', borderRadius: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={18} color="white" />
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-on-surface)', margin: 0 }}>1,000 RWF Micro-Course Purchases</h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-on-surface-variant)', margin: 0 }}>Permanent lecture playback with complete localized code examples and printable AUCA summaries.</p>
            </div>
          </div>

          {unlockedLessons.length === 0 ? (
            <EmptyState icon={<Monitor size={40} />} title="No lessons yet" msg="Explore the feed and unlock your first 1,000 RWF micro-lesson." href="/" cta="Explore Lessons →" />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {unlockedLessons.filter((l) => !filterVal || l.title.toLowerCase().includes(filterVal.toLowerCase())).map((lesson) => (
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
            <EmptyState icon={<CalendarDays size={40} />} title="No upcoming sessions" msg="Book a live or in-person tutoring session from any lesson page." href="/" cta="Explore Lessons →" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} lessons={appLessons} onComplete={() => markBookingCompleted(booking.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Past Sessions */}
      {activeTab === 'history' && (
        <div>
          {pastBookings.length === 0 ? (
            <EmptyState icon={<History size={40} />} title="No past sessions yet" msg="Completed sessions will appear here after you mark them done." href="#" cta="See upcoming sessions" onClick={() => setActiveTab('sessions')} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} lessons={appLessons} onComplete={() => {}} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, msg, href, cta, onClick }: { icon: React.ReactNode; title: string; msg: string; href: string; cta: string; onClick?: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', border: '1px solid var(--color-outline-variant)', borderRadius: '0.875rem' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-surface-container)', color: 'var(--color-outline)', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 0.375rem' }}>{title}</h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-on-surface-variant)', maxWidth: '24rem', margin: '0 auto 1.25rem' }}>{msg}</p>
      <a href={href} onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5625rem 1.25rem', borderRadius: '0.625rem', backgroundColor: 'var(--color-primary)', color: 'white', fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
        <PlayCircle size={15} /> {cta}
      </a>
    </div>
  );
}
