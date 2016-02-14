import json
import pickle
import sys
from pprint import pprint

from pyrope import Replay


class Generator(object):

    def __init__(self):
        file_path = sys.argv[1]

        try:
            self.replay = pickle.load(open(file_path + '.pickle', "rb"))
            self.replay_id = self.replay.header['Id']
        except:
            self.replay = Replay(path=file_path)
            self.replay_id = self.replay.header['Id']
            self.replay.parse_netstream()

            pickle.dump(self.replay, open(file_path + '.pickle', 'wb'))

        self.players = self.get_players()

        for player in self.players:
            # Get their position data.
            self.players[player]['position_data'] = self.get_player_position_data(player)

        # Restructure the data so that it's chunkable.
        frame_data = []

        for frame in range(self.replay.header['NumFrames']):
            frame_dict = {
                'time': self.replay.netstream[frame].current,
                'actors': []
            }

            for player in self.players:
                position_data = self.players[player]['position_data']

                if frame in position_data:
                    frame_dict['actors'].append({
                        'id': player,
                        'type': 'car',
                        **position_data[frame]
                    })

            frame_data.append(frame_dict)

        assert len(frame_data) == self.replay.header['NumFrames'], "Missing {} frames from data output.".format(
            self.replay.header['NumFrames'] - len(frame_data)
        )

        # Get min and max z values.
        for axis in ['x', 'y', 'z']:
            values = [
                actor[axis]
                for frame in frame_data
                for actor in frame['actors']
            ]

            print(axis, min(values), max(values))

        json.dump(frame_data, open(file_path + '.json', 'w'), indent=2)

    def get_players(self):
        players = {}

        for index, frame in self.replay.netstream.items():
            pri_ta = [value for name, value in frame.actors.items() if 'e_Default__PRI_TA' in name]

            for value in pri_ta:
                """
                Example `value`:

                {'actor_id': 2,
                 'actor_type': 'TAGame.Default__PRI_TA',
                 'data': {'Engine.PlayerReplicationInfo:Ping': 24,
                          'Engine.PlayerReplicationInfo:PlayerID': 656,
                          'Engine.PlayerReplicationInfo:PlayerName': "AvD Sub'n",
                          'Engine.PlayerReplicationInfo:Team': (True, 6),
                          'Engine.PlayerReplicationInfo:UniqueId': (1, 76561198040631598, 0),
                          'Engine.PlayerReplicationInfo:bReadyToPlay': True,
                          'TAGame.PRI_TA:CameraSettings': {'dist': 270.0,
                                                           'fov': 107.0,
                                                           'height': 110.0,
                                                           'pitch': -2.0,
                                                           'stiff': 1.0,
                                                           'swiv': 4.300000190734863},
                          'TAGame.PRI_TA:ClientLoadout': (11, [23, 0, 613, 39, 752, 0, 0]),
                          'TAGame.PRI_TA:ClientLoadoutOnline': (11, 0, 0),
                          'TAGame.PRI_TA:PartyLeader': (1, 76561198071203042, 0),
                          'TAGame.PRI_TA:ReplicatedGameEvent': (True, 1),
                          'TAGame.PRI_TA:Title': 0,
                          'TAGame.PRI_TA:TotalXP': 9341290,
                          'TAGame.PRI_TA:bUsingSecondaryCamera': True},
                 'new': False,
                 'startpos': 102988}
                 """

                if 'Engine.PlayerReplicationInfo:PlayerName' not in value['data']:
                    continue

                team_id = None
                actor_id = value['actor_id']

                if 'Engine.PlayerReplicationInfo:Team' in value['data']:
                    team_id = value['data']['Engine.PlayerReplicationInfo:Team'][1]

                player_name = value['data']['Engine.PlayerReplicationInfo:PlayerName']

                if actor_id in players:
                    if (not players[actor_id]['team'] and team_id) or team_id == -1:
                        players[actor_id]['team'] = team_id

                elif 'TAGame.PRI_TA:ClientLoadout' in value['data']:
                    players[actor_id] = {
                        'join': index,
                        'left': self.replay.header['NumFrames'],
                        'name': player_name,
                        'team': team_id,
                    }

        return players

    def get_player_position_data(self, player_id):
        player = self.players[player_id]
        result = {}

        car_actor_obj = None

        for index in range(player['join'], player['left']):
            frame = self.replay.netstream[index]
            # pprint(frame.actors)

            # First we need to find the player's car object.
            for actor in frame.actors:
                actor_obj = frame.actors[actor]

                if 'data' not in actor_obj:
                    continue

                engine = actor_obj['data'].get('Engine.Pawn:PlayerReplicationInfo')

                # This is the correct object for this player.
                if engine and engine[1] == player_id:
                    car_actor_obj = actor_obj['actor_id']

                # If the actor we're looking at is the car object, then get the
                # position and rotation data for this frame.
                if actor_obj['actor_id'] == car_actor_obj:
                    state_data = actor_obj['data'].get('TAGame.RBActor_TA:ReplicatedRBState')

                    if state_data:
                        x, y, z = state_data['pos']
                        pitch, roll, yaw = state_data['rot']

                        result[index] = {
                            'x': x,
                            'y': y,
                            'z': z,
                            'pitch': pitch,
                            'roll': roll,
                            'yaw': yaw
                        }

        return result


if __name__ == '__main__':
    Generator()
