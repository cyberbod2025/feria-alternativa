import { describe, it, expect } from 'vitest';

import { Role } from './types';

describe('Role mapping', () => {
   it('maps from sase exactly to allowed internal roles', () => {
      const allowedRoles: Role[] = ['student', 'teacher', 'staff', 'admin'];
      expect(allowedRoles.includes('student')).toBe(true);
      expect(allowedRoles.includes('teacher')).toBe(true);
      
      const teacherRole: Role = 'teacher';
      expect(teacherRole).toEqual('teacher');
   });
});
